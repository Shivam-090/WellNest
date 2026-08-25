import { useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useWellness } from '../../contexts/WellnessContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickPrompts from './QuickPrompts';
import { Trash2, Menu, Plus, Sparkles } from 'lucide-react';

export default function ChatWindow({ onToggleMobileSidebar }) {
  const { activeSession, sendMessage, isTyping, deleteSession, createNewSession } = useChat();
  const { character } = useWellness();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isTyping]);

  const handleSend = (text) => {
    sendMessage(activeSession?.id, text);
  };

  const handleClear = () => {
    if (activeSession) {
      deleteSession(activeSession.id);
    }
  };

  return (
    <section className="flex-1 min-w-0 h-full flex flex-col overflow-hidden bg-transparent animate-fade-in relative w-full">
      {/* Pinned Edge-to-Edge Header */}
      <header className="px-4 sm:px-6 py-3.5 border-b border-surface-border glass-nav flex items-center justify-between shrink-0 w-full">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-card transition-colors cursor-pointer shrink-0"
            title="Open Conversations Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-secondary to-primary-light flex items-center justify-center text-lg shadow-sm shrink-0">
            🌸
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-text-primary truncate">
                {activeSession?.title || 'NestAI Companion'}
              </h2>
              {/* WellNest Brand Badge */}
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-secondary/20 text-secondary px-2.5 py-0.5 rounded-full shrink-0 border border-secondary/30">
                <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
                <span>WellNest</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => createNewSession()}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-soft text-primary hover:bg-primary-soft/80 font-bold text-xs transition-colors cursor-pointer"
            title="Start fresh conversation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
          <button
            onClick={handleClear}
            className="text-text-secondary hover:text-accent p-2 rounded-xl hover:bg-surface-card transition-colors cursor-pointer"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Full-Width Edge-to-Edge Internally Scrollable Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar w-full space-y-3">
        {activeSession?.messages?.map((m) => (
          <ChatMessage key={m.id} message={m} userChar={character} />
        ))}

        {/* Typing Animation Bubble with Local Model reflection indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 my-3 animate-fade-in w-full justify-start">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-secondary to-primary-light flex items-center justify-center text-sm shadow-sm shrink-0">
              🌸
            </div>
            <div className="bg-surface-card backdrop-blur-md rounded-3xl rounded-tl-sm px-5 py-3.5 border border-surface-border shadow-sm flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-[11px] font-semibold text-text-secondary">
                Reflecting with WellNest...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Pinned Bottom Input & Suggestions Container across full width */}
      <footer className="px-4 sm:px-6 py-3 shrink-0 bg-surface/90 glass-nav border-t border-surface-border w-full space-y-2">
        <QuickPrompts onSelectPrompt={handleSend} disabled={isTyping} />
        <ChatInput onSendMessage={handleSend} disabled={isTyping} />
      </footer>
    </section>
  );
}
