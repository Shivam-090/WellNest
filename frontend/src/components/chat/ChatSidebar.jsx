import { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search, 
  Sparkles,
  Bot
} from 'lucide-react';

export default function ChatSidebar({ isMobileOpen, onCloseMobile }) {
  const { 
    sessions, 
    activeSessionId, 
    selectSession, 
    createNewSession, 
    deleteSession, 
    renameSession 
  } = useChat();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartRename = (s, e) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const handleSaveRename = (sId, e) => {
    e.stopPropagation();
    renameSession(sId, editTitle);
    setEditingId(null);
  };

  const handleDelete = (sId, e) => {
    e.stopPropagation();
    deleteSession(sId);
  };

  const handleSelect = (sId) => {
    selectSession(sId);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNewChat = () => {
    createNewSession();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`
        w-72 sm:w-80 bg-surface/90 glass-nav p-4 sm:p-5 border-r border-surface-border
        flex flex-col h-full shadow-lg shrink-0 overflow-hidden transition-all duration-300 z-30
        ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 z-50 w-4/5 max-w-xs'
            : 'hidden md:flex'
        }
      `}
    >
      {/* Top Header & Close for Mobile */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-border/60 shrink-0 md:hidden">
        <div className="flex items-center gap-2 font-serif font-bold text-sm text-text-primary">
          <Bot className="w-4 h-4 text-primary" />
          <span>Chat History</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-full text-text-secondary hover:text-text-primary cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat Action Button */}
      <div className="shrink-0 mb-3">
        <button
          onClick={handleNewChat}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Search Conversations Input */}
      <div className="relative mb-3 shrink-0">
        <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-input border border-surface-border text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary font-sans transition-colors"
        />
      </div>

      {/* Scrollable Conversations List */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
        <div className="text-[10px] uppercase tracking-widest font-bold text-text-secondary px-2 mb-1.5 flex items-center justify-between">
          <span>Recent Conversations</span>
          <span className="font-bold text-text-primary">{filteredSessions.length}</span>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 px-4 text-xs text-text-secondary">
            <p>No matching chats found</p>
          </div>
        ) : (
          filteredSessions.map((s) => {
            const isActive = s.id === activeSessionId;
            const isEditing = editingId === s.id;

            return (
              <div
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className={`group relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-surface-card text-text-primary border border-primary/60 shadow-sm font-bold ring-1 ring-primary/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-card/60 border border-transparent'
                }`}
              >
                {/* Title or Inline Edit Input */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-primary' : 'text-text-secondary opacity-70'
                    }`}
                  />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-2 py-0.5 rounded-lg bg-surface-input text-text-primary text-xs border border-primary outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate font-sans">{s.title}</span>
                  )}
                </div>

                {/* Quick Actions (Rename / Delete) */}
                <div className="flex items-center gap-1 shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={(e) => handleSaveRename(s.id, e)}
                        className="p-1 text-secondary hover:text-primary cursor-pointer"
                        title="Save title"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="p-1 text-text-secondary hover:text-red-400 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="hidden group-hover:flex items-center gap-1">
                      <button
                        onClick={(e) => handleStartRename(s, e)}
                        className="p-1 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(s.id, e)}
                        className="p-1 text-text-secondary hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Status */}
      <div className="pt-3 mt-2 border-t border-surface-border/60 text-center shrink-0">
        <div className="text-[11px] font-semibold text-text-secondary flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-secondary" />
          <span>NestAI Stress Relief Companion</span>
        </div>
      </div>
    </aside>
  );
}
