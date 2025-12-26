'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize on client side only
  useEffect(() => {
    setIsMounted(true);
    
    // Get the theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    let currentTheme: Theme = 'light';
    
    if (storedTheme) {
      currentTheme = storedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
    }
    
    setTheme(currentTheme);
    applyTheme(currentTheme);
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (isMounted) {
      applyTheme(theme);
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  // Don't render context until mounted
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
