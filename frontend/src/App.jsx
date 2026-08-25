import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/common/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicOnlyRoute from './components/common/PublicOnlyRoute';
import { useAuth } from './contexts/AuthContext';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Cover & Home Pages
import CoverPage from './pages/cover/CoverPage';
import HomePage from './pages/home/HomePage';

// Profile Pages
import SetupPage from './pages/profile/SetupPage';

// Check-in Pages
import CheckInPage from './pages/checkIn/CheckInPage';
import CheckInResultPage from './pages/checkIn/CheckInResultPage';

// Activity Pages
import ActivityPage from './pages/activity/ActivityPage';
import DonePage from './pages/activity/DonePage';

// Journey Pages
import JourneyPage from './pages/journey/JourneyPage';

// Chat Page
import ChatPage from './pages/chat/ChatPage';

// Root Entry Handler: Redirects to /home if authenticated, else to /login
function RootEntry() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Entry / Landing: redirects to /home if token available, else to /login */}
        <Route path="/" element={<RootEntry />} />
        <Route path="/cover" element={<CoverPage />} />

        {/* Public-only Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Routes (Authentication Required) */}
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <SetupPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Check-in Assessment & Results (Protected) */}
        <Route
          path="/checkin"
          element={
            <ProtectedRoute>
              <CheckInPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkin/results"
          element={
            <ProtectedRoute>
              <CheckInResultPage />
            </ProtectedRoute>
          }
        />
        <Route path="/assessment" element={<Navigate to="/checkin" replace />} />
        <Route path="/results" element={<Navigate to="/checkin/results" replace />} />

        {/* Activities & Relief Routine (Protected) */}
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <ActivityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity/done"
          element={
            <ProtectedRoute>
              <DonePage />
            </ProtectedRoute>
          }
        />
        <Route path="/activities" element={<Navigate to="/activity" replace />} />
        <Route path="/done" element={<Navigate to="/activity/done" replace />} />

        {/* Journey & Gamification (Protected) */}
        <Route
          path="/journey"
          element={
            <ProtectedRoute>
              <JourneyPage />
            </ProtectedRoute>
          }
        />

        {/* AI Chat Companion (Protected) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
