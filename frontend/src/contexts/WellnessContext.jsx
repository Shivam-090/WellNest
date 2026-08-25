import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SLIDER_VALUES } from '../data/assessmentData';
import { DAILY_ACTIVITIES } from '../data/activitiesData';
import { calculateLevel, getXpProgressDetails } from '../data/levelsData';
import { runWellnessInference } from '../services/mlModel';
import { checkInService, taskService, journeyService } from '../services/api';
import { useAuth } from './AuthContext';

const WellnessContext = createContext(null);

export function WellnessProvider({ children }) {
  const { user, updateProfile } = useAuth();
  
  const [sliderValues, setSliderValues] = useState(INITIAL_SLIDER_VALUES);
  const [selectedMood, setSelectedMood] = useState(null);
  const [mlResult, setMlResult] = useState(() => {
    const saved = localStorage.getItem('wellnest_latest_result');
    return saved ? JSON.parse(saved) : null;
  });

  // Task List Management State (with Day-based Auto Reset)
  const [tasks, setTasks] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('wellnest_custom_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Auto-reset tasks completed on previous days
          return parsed.map((t) => ({
            ...t,
            completed: t.completed && t.lastCompletedDate === today
          }));
        }
      } catch {
        // Fallback
      }
    }
    return DAILY_ACTIVITIES.map((act) => ({
      ...act,
      isCustom: false,
      completed: false,
      lastCompletedDate: null,
      createdAt: new Date().toISOString()
    }));
  });

  // Load tasks & journey from backend on mount or user change
  useEffect(() => {
    async function fetchBackendData() {
      try {
        const taskRes = await taskService.getTasks();
        if (taskRes?.tasks && Array.isArray(taskRes.tasks) && taskRes.tasks.length > 0) {
          setTasks(taskRes.tasks.map((t) => ({ ...t, id: t._id || t.id })));
        }
      } catch (err) {
        console.warn('Backend task fetch note:', err.message);
      }
    }
    if (user) {
      fetchBackendData();
    }
  }, [user]);

  const xp = user?.xp !== undefined ? user.xp : 120;
  const streak = user?.streak !== undefined ? user.streak : 1;
  const level = user?.level || calculateLevel(xp, streak);
  const xpDetails = getXpProgressDetails(xp, level);
  const character = user?.character || '🦊';
  const nickname = user?.name || 'Hero';

  useEffect(() => {
    localStorage.setItem('wellnest_custom_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const updateSlider = (feat, value) => {
    setSliderValues((prev) => ({
      ...prev,
      [feat]: Number(value)
    }));
  };

  const calculateResults = async () => {
    const localResult = runWellnessInference(sliderValues);

    try {
      const res = await checkInService.saveAssessment({
        mood: selectedMood,
        sliderValues
      });

      if (res?.checkIn?.mlResult) {
        const finalResult = {
          ...localResult,
          ...res.checkIn.mlResult,
          pred: res.checkIn.mlResult.pred !== undefined ? res.checkIn.mlResult.pred : localResult.pred,
          stressPct: res.checkIn.mlResult.stressPct !== undefined ? res.checkIn.mlResult.stressPct : localResult.stressPct,
          confidence: res.checkIn.mlResult.confidence || 92,
          titleText: res.checkIn.mlResult.titleText || localResult.titleText,
          descText: res.checkIn.mlResult.descText || localResult.descText,
          aiInsight: res.checkIn.mlResult.aiInsight || localResult.aiInsight,
          factorChips: res.checkIn.mlResult.factorChips || localResult.factorChips,
          recommendations: res.checkIn.mlResult.recommendations || localResult.recommendations,
          affirmation: res.checkIn.mlResult.affirmation
        };
        setMlResult(finalResult);
        localStorage.setItem('wellnest_latest_result', JSON.stringify(finalResult));
        return finalResult;
      }
    } catch (err) {
      console.warn('Ollama backend check-in evaluation fallback:', err.message);
    }

    setMlResult(localResult);
    localStorage.setItem('wellnest_latest_result', JSON.stringify(localResult));
    return localResult;
  };

  // Task Management Handlers
  const addTask = async (newTaskData) => {
    const localId = 'task_' + Date.now();
    const taskPayload = {
      name: newTaskData.name.trim(),
      desc: newTaskData.desc?.trim() || 'Personal wellness goal.',
      emoji: newTaskData.emoji || '✨',
      tag: newTaskData.tag || `${newTaskData.durationMinutes || 10} minutes`,
      durationMinutes: Number(newTaskData.durationMinutes) || 10,
      bgGradient: newTaskData.bgGradient || 'from-[#3D6B56] to-[#52936E]'
    };

    const newTask = {
      id: localId,
      ...taskPayload,
      isCustom: true,
      completed: false,
      completedAt: null,
      lastCompletedDate: null,
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);

    // Backend save via Axios
    try {
      const res = await taskService.createTask(taskPayload);
      if (res?.task) {
        setTasks((prev) =>
          prev.map((t) => (t.id === localId ? { ...res.task, id: res.task._id || res.task.id } : t))
        );
      }
    } catch (err) {
      console.warn('Backend task create cached locally:', err.message);
    }

    return newTask;
  };

  const updateTask = async (taskId, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
    try {
      await taskService.updateTask(taskId, updates);
    } catch (err) {
      console.warn('Backend task update cached locally:', err.message);
    }
  };

  const deleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await taskService.deleteTask(taskId);
    } catch (err) {
      console.warn('Backend task delete cached locally:', err.message);
    }
  };

  const toggleTaskDone = async (taskId) => {
    const today = new Date().toISOString().split('T')[0];
    let earnedXp = 0;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            earnedXp = 25;
          }
          return { 
            ...t, 
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
            lastCompletedDate: nextCompleted ? today : (t.lastCompletedDate === today ? null : t.lastCompletedDate)
          };
        }
        return t;
      })
    );

    if (earnedXp > 0) {
      addXp(earnedXp, 'Daily Task Completed');
    }

    try {
      await taskService.toggleTaskComplete(taskId);
    } catch (err) {
      console.warn('Backend toggle cached locally:', err.message);
    }
  };

  const addXp = async (amount, reason = 'Activity Completion') => {
    const newXp = xp + amount;
    const newLevel = calculateLevel(newXp, streak);
    
    updateProfile({ xp: newXp, level: newLevel });

    try {
      await journeyService.addXp(amount, reason);
    } catch (err) {
      console.warn('Backend XP synced locally:', err.message);
    }
  };

  const resetAssessment = () => {
    setSliderValues(INITIAL_SLIDER_VALUES);
    setSelectedMood(null);
    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalMinutesSpent = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.durationMinutes || 10), 0);

  return (
    <WellnessContext.Provider
      value={{
        sliderValues,
        updateSlider,
        selectedMood,
        setSelectedMood,
        mlResult,
        calculateResults,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskDone,
        completedCount,
        totalMinutesSpent,
        xp,
        streak,
        level,
        xpDetails,
        character,
        nickname,
        addXp,
        resetAssessment
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  const context = useContext(WellnessContext);
  if (!context) throw new Error('useWellness must be used within a WellnessProvider');
  return context;
}
