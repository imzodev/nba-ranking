"use client";

import { ReactNode, useEffect } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // Function to apply theme based on localStorage or system preference
  const applyTheme = () => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  };

  useEffect(() => {
    // Apply theme on initial load
    applyTheme();

    // Create a storage event listener to detect theme changes from other components
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme') {
        applyTheme();
      }
    };

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaQueryChange = () => {
      if (!('theme' in localStorage)) {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return <>{children}</>;
}
