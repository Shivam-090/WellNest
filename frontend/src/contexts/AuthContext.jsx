import { createContext, useContext, useState, useEffect } from 'react';
import { authService, getStoredToken, getStoredUser, clearStoredAuth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(() => {
    // If a token exists, keep loading true until initial validation finishes
    const token = getStoredToken();
    return !!token;
  });

  useEffect(() => {
    async function syncProfile() {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getProfile();
        if (res?.user) {
          setUser(res.user);
        } else {
          console.warn('Invalid user data returned from profile sync.');
        }
      } catch (err) {
        console.warn('Profile sync notice:', err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          clearStoredAuth();
          setUser(null);
          window.dispatchEvent(
            new CustomEvent('wellnest:auth_expired', {
              detail: { message: 'Your session has expired. Please log in again.' }
            })
          );
        }
      } finally {
        setLoading(false);
      }
    }
    syncProfile();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data?.success && data?.user) {
      setUser(data.user);
    }
    return data;
  };

  const signup = async (name, email, password, character, theme) => {
    const data = await authService.signup({ name, email, password, character, theme });
    if (data?.success && data?.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    clearStoredAuth();
    if (authService.logout) authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfile = async (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });
    const res = await authService.updateProfile(updates);
    if (res?.user) {
      setUser(res.user);
    }
    return res;
  };

  const changePassword = async (newPassword) => {
    const res = await authService.changePassword(newPassword);
    return res;
  };

  const isAuthenticated = !!(user && getStoredToken());

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
