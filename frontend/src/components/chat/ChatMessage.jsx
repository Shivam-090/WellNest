import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

function formatInline(text, isAi) {
  if (!text) return null;
  // Match bold **...**, italic *...*, and inline code `...`
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong
          key={index}
          className={
            isAi
              ? 'font-bold text-text-primary tracking-tight font-sans drop-shadow-xs'
              : 'font-extrabold text-white tracking-tight font-sans'
          }
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic opacity-90 font-serif">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${
            isAi
              ? 'bg-surface-input border border-surface-border text-primary font-semibold'
              : 'bg-white/20 text-white font-semibold'
          }`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function FormattedMessageContent({ text, isAi }) {
  if (!text) return null;

  const lines = text.split('\n');
  const blocks = [];
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    // Check for bullet list item: starts with "- ", "* ", "• "
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'bullet') {
        flushList();
        currentList = { type: 'bullet', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      return;
    }

    // Check for numbered list item: starts with "1. ", "2. ", etc.
    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (numMatch) {
      if (!currentList || currentList.type !== 'number') {
        flushList();
        currentList = { type: 'number', items: [] };
      }
      currentList.items.push({ num: numMatch[1], text: numMatch[2] });
      return;
    }

    // Check for markdown headings
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2]
      });
      return;
    }

    // Regular paragraph
    flushList();
    blocks.push({ type: 'paragraph', text: trimmed });
  });

  flushList();

  return (
    <div className="space-y-3 leading-relaxed text-sm font-sans">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          return (
            <h4
              key={idx}
              className={`font-serif font-bold text-base mt-3 mb-1.5 flex items-center gap-1.5 ${
                isAi ? 'text-primary' : 'text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 opacity-80 shrink-0" />
              <span>{formatInline(block.text, isAi)}</span>
            </h4>
          );
        }

        if (block.type === 'bullet') {
          return (
            <ul key={idx} className="space-y-2.5 my-3 pl-1">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className={`flex items-start gap-3 p-2 rounded-2xl transition-colors ${
                    isAi
                      ? 'bg-surface/50 border border-surface-border/60 hover:bg-surface/80'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 shadow-xs ${
                      isAi ? 'bg-primary' : 'bg-white'
                    }`}
                  />
                  <div className="flex-1 text-[13.5px] leading-relaxed">
                    {formatInline(item, isAi)}
                  </div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'number') {
          return (
            <ol key={idx} className="space-y-2.5 my-3 pl-1">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className={`flex items-start gap-3 p-2.5 rounded-2xl transition-colors ${
                    isAi
                      ? 'bg-surface/50 border border-surface-border/60 hover:bg-surface/80'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-xl text-[11px] font-extrabold shrink-0 mt-0.5 shadow-xs ${
                      isAi
                        ? 'bg-primary-soft text-primary border border-primary/40'
                        : 'bg-white/25 text-white'
                    }`}
                  >
                    {item.num}
                  </span>
                  <div className="flex-1 text-[13.5px] leading-relaxed">
                    {formatInline(item.text, isAi)}
                  </div>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={idx} className="leading-relaxed text-[13.5px] sm:text-sm">
            {formatInline(block.text, isAi)}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatMessage({ message, userChar = '🦊' }) {
  const isAi = message.sender === 'ai';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 my-3.5 animate-fade-in w-full ${
        isAi ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* AI Avatar on left edge */}
      {isAi && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-secondary to-primary-light flex items-center justify-center text-sm shadow-sm shrink-0 mt-1 ring-1 ring-white/10">
          🌸
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`group relative max-w-[92%] sm:max-w-[82%] md:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-sm transition-all duration-200 ${
          isAi
            ? 'bg-surface-card backdrop-blur-md text-text-primary rounded-tl-sm border border-surface-border hover:shadow-md'
            : 'bg-gradient-to-r from-primary to-primary-deep text-white rounded-tr-sm shadow-md'
        }`}
      >
        {/* Formatted Content */}
        <FormattedMessageContent text={message.text} isAi={isAi} />

        {/* Footer info: time + copy action button */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-border/40 text-[10px] font-semibold">
          <div className="flex items-center gap-1.5 opacity-75">
            {isAi && <span>NestAI</span>}
          </div>

          <div className="flex items-center gap-2">
            {isAi && (
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-surface-input text-text-secondary hover:text-text-primary flex items-center gap-1 cursor-pointer"
                title="Copy advice"
              >
                {copied ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                <span className="text-[9px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
            <span className={isAi ? 'text-text-secondary' : 'text-white/80'}>
              {message.time || 'Just now'}
            </span>
          </div>
        </div>
      </div>

      {/* User Avatar on right edge */}
      {!isAi && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm shadow-sm shrink-0 mt-1 ring-1 ring-white/10">
          {userChar}
        </div>
      )}
    </div>
  );
}
