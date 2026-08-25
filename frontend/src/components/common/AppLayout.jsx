import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import PetalCanvas from './PetalCanvas';
import ProfileModal from '../profile/ProfileModal';
import SessionExpiredModal from './SessionExpiredModal';

export default function AppLayout() {
  const location = useLocation();
  // Hide top navigation on splash cover, login, signup, setup pages
  const hideNavRoutes = ['/', '/login', '/signup', '/setup'];
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-500">
      <PetalCanvas />
      {showNav && <Navbar />}
      <main className="flex-1 flex flex-col relative z-10">
        <Outlet />
      </main>
      <ProfileModal />
      <SessionExpiredModal />
    </div>
  );
}
