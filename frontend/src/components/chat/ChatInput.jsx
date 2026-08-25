import { useState } from 'react';
import { Send, Smile, Loader2 } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    const clean = text.trim();
    if (clean && clean.length <= 500) {
      onSendMessage(clean);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2.5 w-full">
      <div className="relative flex-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          placeholder={
            disabled
              ? '🌸 WellNest is reflecting, please wait a moment...'
              : "Share what's on your mind or ask for guidance..."
          }
          disabled={disabled}
          className={`w-full pl-5 pr-12 py-3.5 sm:py-4 rounded-full bg-surface-input backdrop-blur-md border border-surface-border text-text-primary placeholder-text-secondary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all ${
            disabled ? 'opacity-65 cursor-not-allowed bg-surface/40' : ''
          }`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
          <Smile className="w-5 h-5 opacity-70" />
        </div>
      </div>

      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
        title={disabled ? 'Waiting for response...' : 'Send message'}
      >
        {disabled ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5 ml-0.5" />
        )}
      </button>
    </form>
  );
}
