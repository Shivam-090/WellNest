import { useState } from 'react';
import { useWellness } from '../../contexts/WellnessContext';
import { useTheme } from '../../contexts/ThemeContext';
import AddTaskModal from './AddTaskModal';
import { Check, Plus, Edit2, Trash2, Sparkles } from 'lucide-react';

export default function ActivityGrid() {
  const { tasks, toggleTaskDone, deleteTask } = useWellness();
  const { burstPetals } = useTheme();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'active') return !t.completed;
    if (activeTab === 'completed') return t.completed;
    return true;
  });

  const handleToggle = (task) => {
    burstPetals();
    toggleTaskDone(task.id);
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task, e) => {
    e.stopPropagation();
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (taskId, e) => {
    e.stopPropagation();
    deleteTask(taskId);
  };

  return (
    <div className="mb-8">
      {/* Management Toolbar: Tabs & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-card glass-panel border border-surface-border rounded-full shadow-2xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Add Custom Task CTA */}
        <button
          onClick={handleOpenAdd}
          className="py-2 px-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Grid of Tasks */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-surface-card glass-panel rounded-3xl border border-surface-border p-8">
          <div className="text-5xl mb-3">🌿</div>
          <h4 className="font-serif text-lg font-bold text-text-primary mb-1">
            {activeTab === 'completed' ? 'No completed tasks yet' : 'No tasks in this list'}
          </h4>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
            {activeTab === 'completed'
              ? 'Click on any active task above to mark it done and earn +25 XP!'
              : 'Add your own customized wellness goal to build your personalized routine.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-6 rounded-full bg-primary text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create a Task</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredTasks.map((act) => {
            const isDone = act.completed;

            return (
              <div
                key={act.id}
                onClick={() => handleToggle(act)}
                className={`group relative rounded-3xl p-6 bg-gradient-to-br ${act.bgGradient} text-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 cursor-pointer overflow-hidden select-none flex flex-col justify-between min-h-[220px] ${
                  isDone ? 'opacity-65 ring-2 ring-white/60' : 'opacity-100'
                }`}
              >
                {/* Top Row: Custom Actions & Checkmark */}
                <div className="flex items-start justify-between mb-2">
                  <div className="text-4xl">{act.emoji}</div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit & Delete for Custom Tasks */}
                    {act.isCustom && (
                      <div className="hidden group-hover:flex items-center gap-1 bg-black/30 backdrop-blur-md rounded-full px-2 py-1">
                        <button
                          onClick={(e) => handleOpenEdit(act, e)}
                          className="p-1 hover:text-primary-light transition-colors cursor-pointer"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(act.id, e)}
                          className="p-1 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Checkbox badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-white text-bark shadow-md scale-105 font-bold'
                          : 'bg-white/20 hover:bg-white/40 text-transparent border border-white/40'
                      }`}
                    >
                      <Check className={`w-4 h-4 stroke-[3] ${isDone ? 'opacity-100 text-bark' : 'opacity-0'}`} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="my-2">
                  <h3 className="font-serif text-lg font-bold mb-1.5 text-white tracking-tight leading-snug">
                    {act.name}
                  </h3>
                  <p className="text-xs text-white/85 leading-relaxed line-clamp-3">
                    {act.desc}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                  <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-[11px] font-semibold text-white">
                    {act.tag}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-white/80">
                    {isDone ? '✓ Completed (+25 XP)' : '+25 XP'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        editingTask={editingTask}
      />
    </div>
  );
}
