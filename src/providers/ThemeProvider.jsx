// components/theme-provider.jsx
'use client'; // This is essential for Next.js App Router to make it a client component

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}