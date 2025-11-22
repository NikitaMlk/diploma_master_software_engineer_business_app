'use client';

import { LanguageProvider } from './context/LanguageContext';
import Providers from './providers';
import { SessionProvider } from 'next-auth/react';


import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner"; // Using sonner's Toaster

import DashboardHeader from '@/components/layout/DashboardHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <SessionProvider>
        <LanguageProvider>
          <Providers>
            <DashboardSidebar />

            {/* This div handles the main background theme */}
            <div className="flex flex-col min-h-screen w-full bg-background">
              <DashboardHeader />
              <main className="flex-1 overflow-auto p-6 bg-background"> {/* Ensuring main also respects background */}
                <Breadcrumbs />
                <div className="mt-4">
                  <SidebarTrigger />
                  {children}
                  <Toaster /> {/* Place Toaster outside the main content for consistent display */}
                </div>
              </main>
            </div>
          </Providers>
        </LanguageProvider>
      </SessionProvider>
    </SidebarProvider>
  );
}
