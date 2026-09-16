import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // ── Load saved theme from localStorage, default to 'system' ──
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('sphere-theme') as Theme;
    return stored || 'system';
  });

  // ── Resolved theme (actual dark/light based on system preference) ──
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      // If theme is 'system', use the system preference, otherwise use the set theme
      const resolved = theme === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : theme;
      setResolvedTheme(resolved);
      // Apply the theme to the <html> element – this triggers CSS variable changes
      document.documentElement.setAttribute('data-theme', resolved);
    };

    updateTheme();

    // Listen for system theme changes when in 'system' mode
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  // ── Persist theme preference ──
  useEffect(() => {
    localStorage.setItem('sphere-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}