'use client';

import { useState } from 'react';
import { LanguageProvider } from '../../context/LanguageContext';
import Providers from '../../providers';
import { SessionProvider } from 'next-auth/react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from 'sonner';
import AppSidebar from '@/components/dashboard/Sidebar';

export default function SimplifiedUserDashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <SessionProvider>
      <LanguageProvider>
        <Providers>
          <SidebarProvider>
            <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarInset>
              {/* Header with breadcrumb */}
              <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 bg-background px-4">
                <SidebarTrigger className="-ml-1" />
              </header>
              
              {/* Main content */}
              <main>
                <div>
                  {children}
                </div>
              </main>
            </SidebarInset>
            <Toaster />
          </SidebarProvider>
        </Providers>
      </LanguageProvider>
    </SessionProvider>
  );
}