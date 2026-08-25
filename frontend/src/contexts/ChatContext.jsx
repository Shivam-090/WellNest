import { createContext, useContext, useState, useEffect } from 'react';
import { useWellness } from './WellnessContext';
import { useTheme } from './ThemeContext';
import { chatService } from '../services/api';

const ChatContext = createContext(null);

function getLocalAiResponse(userMessage, nickname = 'friend') {
  const msg = userMessage.toLowerCase();

  if (msg.includes('breath') || msg.includes('calm') || msg.includes('anxious') || msg.includes('panic')) {
    return `Take a gentle breath with me right now, ${nickname} 🫁.\n\nLet's do 4-4-4 Box Breathing:\n1. 🌿 Inhale deeply through your nose for 4 seconds.\n2. ⏸️ Hold that breath softly for 4 seconds.\n3. 🌬️ Release slowly through your mouth for 4 seconds.\n\nRepeat this 3 times. You don't have to carry everything at once.`;
  }

  if (msg.includes('study') || msg.includes('exam') || msg.includes('overwhelm') || msg.includes('work') || msg.includes('homework')) {
    return `Academic pressure can feel so heavy, ${nickname} 📚.\n\nHere is a grounding thought: Break whatever mountain is in front of you into one tiny 15-minute pebble. Just focus on that single piece.\n\nHave you had some water or stepped away from the screen for 5 minutes today?`;
  }

  if (msg.includes('sleep') || msg.includes('tired') || msg.includes('insomnia') || msg.includes('night')) {
    return `Quality rest is your mind's natural reset button 🌙.\n\nTry this wind-down routine:\n• Dim your screen lighting right now or set your device aside.\n• Unclench your jaw and let your shoulders drop.\n• Visualize a serene forest with a quiet, calm breeze. You are safe, and tomorrow can wait.`;
  }

  if (msg.includes('gratitude') || msg.includes('thankful') || msg.includes('good')) {
    return `I love that you're focusing on gratitude, ${nickname}! 🌸\n\nTell me: What are 2 small things that brought even a tiny smile to your face today? It could be a warm beverage, a comforting song, or just a quiet moment.`;
  }

  if (msg.includes('peer') || msg.includes('friend') || msg.includes('boundar') || msg.includes('lonel')) {
    return `Relationships shape our peace of mind deeply 🫂.\n\nRemember: Saying 'no' to others when you are depleted is saying 'yes' to your own mental wellbeing. True friends will understand and respect your boundaries.`;
  }

  if (msg.includes('motivat') || msg.includes('boost') || msg.includes('sad') || msg.includes('low')) {
    return `You're doing better than you think, ${nickname} ✨.\n\nEvery day you show up — even on difficult days — you are building resilience. Be gentle with your pace. Growth is not a race; blooming takes time.`;
  }

  return `I hear you, ${nickname} 🌸. Thank you for sharing what is on your mind. How is your body feeling right now? Remember to drink some water, relax your shoulders, and know that you are doing your best. Would you like to try a quick breathing reset or talk through what's pressing you most?`;
}

export function ChatProvider({ children }) {
  const { nickname } = useWellness();
  const { burstPetals } = useTheme();

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('wellnest_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    const defaultId = 'chat_' + Date.now();
    return [
      {
        id: defaultId,
        title: 'Welcome & Check-in',
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: 1,
            sender: 'ai',
            text: `Hello ${nickname}! 🌸 I'm your WellNest AI Companion by WellNest. Whether you're feeling stressed about school, need a quick calming breath, or just want to reflect, I'm here for you. How are you feeling today?`,
            time: 'Just now'
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return sessions[0]?.id || '';
  });

  const [isTyping, setIsTyping] = useState(false);

  // Load chat sessions from backend on initial mount
  useEffect(() => {
    async function loadBackendSessions() {
      try {
        const res = await chatService.getSessions();
        if (res?.sessions && Array.isArray(res.sessions) && res.sessions.length > 0) {
          const mapped = res.sessions.map((s) => ({
            id: (s._id || s.id).toString(),
            _id: (s._id || s.id).toString(),
            title: s.title,
            createdAt: s.createdAt,
            messages: (s.messages && s.messages.length > 0)
              ? s.messages.map((m) => ({
                  id: (m._id || m.id || Date.now()).toString(),
                  sender: m.sender,
                  text: m.text,
                  time: m.time || new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }))
              : [
                  {
                    id: 'init_1',
                    sender: 'ai',
                    text: `Hi ${nickname} 🌸 How can I support you in this conversation?`,
                    time: 'Just now'
                  }
                ]
          }));
          setSessions(mapped);
          setActiveSessionId(mapped[0].id);
        }
      } catch (err) {
        console.warn('Backend chat load note:', err.message);
      }
    }
    loadBackendSessions();
  }, [nickname]);

  useEffect(() => {
    localStorage.setItem('wellnest_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Ensure an active session is always valid
  useEffect(() => {
    if (!sessions.some((s) => s.id === activeSessionId) && sessions.length > 0) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const createNewSession = async (initialPrompt = null) => {
    const localId = 'chat_' + Date.now();
    const newSession = {
      id: localId,
      title: initialPrompt ? initialPrompt.slice(0, 28) + '...' : 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: Date.now(),
          sender: 'ai',
          text: `Hi ${nickname} 🌸 New session started. What's on your mind?`,
          time: 'Just now'
        }
      ]
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(localId);
    burstPetals();

    // Call Axios backend
    try {
      const res = await chatService.createSession({
        title: newSession.title,
        initialMessage: initialPrompt
      });
      if (res?.session) {
        const backendId = (res.session._id || res.session.id).toString();
        const serverMessages = res.session.messages || newSession.messages;
        setSessions((prev) =>
          prev.map((s) => (s.id === localId ? { ...s, id: backendId, messages: serverMessages } : s))
        );
        setActiveSessionId(backendId);
      }
    } catch (err) {
      console.warn('Backend session creation note:', err.message);
    }

    if (initialPrompt) {
      setTimeout(() => {
        sendMessage(localId, initialPrompt);
      }, 100);
    }

    return localId;
  };

  const selectSession = async (sessionId) => {
    const strId = sessionId.toString();
    setActiveSessionId(strId);

    // Fetch latest messages from backend to guarantee fresh history
    try {
      const res = await chatService.getMessages(strId);
      if (res?.success && Array.isArray(res.messages)) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === strId
              ? {
                  ...s,
                  messages: res.messages.map((m) => ({
                    id: (m._id || m.id).toString(),
                    sender: m.sender,
                    text: m.text,
                    time: m.time || new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }))
                }
              : s
          )
        );
      }
    } catch (err) {
      console.warn('Fetch session history note:', err.message);
    }
  };

  const deleteSession = async (sessionId) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== sessionId);
      if (remaining.length === 0) {
        const freshId = 'chat_' + Date.now();
        return [
          {
            id: freshId,
            title: 'New Conversation',
            createdAt: new Date().toISOString(),
            messages: [
              {
                id: Date.now(),
                sender: 'ai',
                text: `Hi ${nickname} 🌸 How can I support your wellbeing today?`,
                time: 'Just now'
              }
            ]
          }
        ];
      }
      return remaining;
    });

    try {
      await chatService.deleteSession(sessionId);
    } catch (err) {
      console.warn('Backend session delete note:', err.message);
    }
  };

  const renameSession = async (sessionId, newTitle) => {
    if (!newTitle.trim()) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle.trim() } : s))
    );

    try {
      await chatService.renameSession(sessionId, newTitle.trim());
    } catch (err) {
      console.warn('Backend session rename note:', err.message);
    }
  };

  const sendMessage = async (sessionId, text) => {
    if (isTyping) return; // Only allow one message at a time until response is received
    const cleanText = text?.trim();
    if (!cleanText) return;

    const targetSessionId = sessionId || activeSessionId;
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === targetSessionId) {
          const isFirstUserMessage = s.messages.filter((m) => m.sender === 'user').length === 0;
          const autoTitle =
            isFirstUserMessage && (s.title === 'New Conversation' || s.title === 'Welcome & Check-in')
              ? text.slice(0, 26) + (text.length > 26 ? '...' : '')
              : s.title;

          return {
            ...s,
            title: autoTitle,
            messages: [...s.messages, userMsg]
          };
        }
        return s;
      })
    );

    setIsTyping(true);

    // Call backend
    try {
      const res = await chatService.sendMessage(targetSessionId, text);
      if (res?.aiMessage) {
        const resolvedId = res.sessionId || targetSessionId;
        setSessions((prev) =>
          prev.map((s) =>
            s.id === targetSessionId
              ? {
                  ...s,
                  id: resolvedId,
                  title: res.sessionTitle || s.title,
                  messages: [
                    ...s.messages.filter((m) => m.id !== userMsg.id),
                    { ...userMsg, id: res.userMessage?._id || userMsg.id },
                    {
                      id: res.aiMessage._id || Date.now() + 1,
                      sender: 'ai',
                      text: res.aiMessage.text,
                      time: res.aiMessage.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]
                }
              : s
          )
        );
        if (targetSessionId !== resolvedId) {
          setActiveSessionId(resolvedId);
        }
        setIsTyping(false);
        burstPetals();
        return;
      }
    } catch {
      // Fallback
    }

    // Local simulation fallback if network unreachable
    setTimeout(() => {
      const responseText = getLocalAiResponse(text, nickname);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? { ...s, messages: [...s.messages, aiMsg] }
            : s
        )
      );
      setIsTyping(false);
      burstPetals();
    }, 850);
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSession,
        activeSessionId,
        isTyping,
        createNewSession,
        selectSession,
        deleteSession,
        renameSession,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
}
