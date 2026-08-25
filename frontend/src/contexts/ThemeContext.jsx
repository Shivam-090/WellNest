import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('wellnest_theme') || 'pastel';
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [petalBurstTrigger, setPetalBurstTrigger] = useState(0);

  useEffect(() => {
    // Apply body class
    const body = document.body;
    body.className = body.className.replace(/bg-\w+/g, '').trim();
    body.classList.add(`bg-${theme}`);
    
    const isDark = theme !== 'pastel';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', theme);
    body.classList.toggle('dark', isDark);
    body.setAttribute('data-theme', theme);
    
    localStorage.setItem('wellnest_theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const burstPetals = () => {
    setPetalBurstTrigger((prev) => prev + 1);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isProfileOpen,
        setIsProfileOpen,
        openProfile: () => setIsProfileOpen(true),
        closeProfile: () => setIsProfileOpen(false),
        burstPetals,
        petalBurstTrigger
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
