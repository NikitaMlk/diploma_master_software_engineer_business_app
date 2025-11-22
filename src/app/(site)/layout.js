'use client';

import { SessionProvider } from 'next-auth/react';
import { RegistrationProvider } from '../../context/RegistrationContext';

export default function SiteLayout({ children }) {
  return (
    <SessionProvider>
      <RegistrationProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">

          {/* Main Content */}
          <main className="flex-1 w-full mx-auto">
            {children}
          </main>
        </div>
      </RegistrationProvider>
    </SessionProvider>
  );
}
