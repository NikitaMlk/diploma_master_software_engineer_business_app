"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react"; // Keep useState for internal theme icon state if needed, but remove for mounted
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  // Removed the internal `mounted` state and its `useEffect` and `if (!mounted) return null;`
  // The `useTheme` hook from `next-themes` is designed to handle hydration internally.

  // Use a state for current theme icon to avoid direct reliance on `currentTheme` for initial render
  const [iconTheme, setIconTheme] = useState('light'); // Default to light or a sensible initial state

  // Update iconTheme only on client-side after theme is resolved by next-themes
  useEffect(() => {
    const resolvedTheme = theme === "system" ? systemTheme : theme;
    if (resolvedTheme) { // Ensure resolvedTheme is not null/undefined
      setIconTheme(resolvedTheme);
    }
  }, [theme, systemTheme]);

  const toggleTheme = () => {
    const resolvedTheme = theme === "system" ? systemTheme : theme;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      aria-label="Toggle Theme"
      type="button"
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      onClick={toggleTheme}
    >
      <Sun className="w-5 h-5 text-yellow-500" />
    </button>
  );
}
