"use client";

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode state based on current class on document
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;
    
    // Check if dark class is present on html element
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Toggle dark mode following the documentation approach
  const toggleDarkMode = () => {
    if (isDarkMode) {
      // Switch to light mode
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      // Dispatch storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'theme',
        newValue: 'light',
        storageArea: localStorage
      }));
      setIsDarkMode(false);
    } else {
      // Switch to dark mode
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      // Dispatch storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'theme',
        newValue: 'dark',
        storageArea: localStorage
      }));
      setIsDarkMode(true);
    }
  };
  
  // Add a method to use system preference
  const useSystemPreference = () => {
    localStorage.removeItem('theme');
    // Dispatch storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'theme',
      newValue: null,
      storageArea: localStorage
    }));
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
    setIsDarkMode(prefersDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-[#17408B] dark:text-[#FDBB30] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ring-1 ring-transparent hover:ring-[#17408B] dark:hover:ring-[#FDBB30]"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}
