import { useState } from 'react';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';

export default function ChatPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="w-full h-[calc(100vh-65px)] flex overflow-hidden relative border-t border-surface-border">
      {/* Full-height Sidebar */}
      <ChatSidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Full-screen Main Chat Area */}
      <ChatWindow onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
    </div>
  );
}
