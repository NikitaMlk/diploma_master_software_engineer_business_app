'use client';

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "../shared/ThemeToggle";
import LanguageSwitcher from "../../app/(user-dashboard)/components/LanguageSwitcher";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Assuming this triggers the sidebar state

export default function UserHeader() {
  const t = useTranslations('userHeader');
  const [mounted, setMounted] = useState(false); // To prevent hydration flicker for client-side components

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Mobile Sidebar Trigger (hidden on desktop, visible on mobile) */}
      <div className="md:hidden">
        {/*
          Removed asChild from SidebarTrigger.
          Assuming SidebarTrigger itself is a component that renders a button internally
          and handles the sidebar toggle via context.
          This prevents the nested asChild issue observed in the Button component.
        */}
        <SidebarTrigger variant="ghost" size="icon" aria-label={t('toggleMenu')}>
          <Menu size={24} />
        </SidebarTrigger>
      </div>

      {/* Placeholder for potential title or breadcrumbs on desktop */}
      <div className="hidden md:block">
        {/* You can add a title or breadcrumbs here if needed */}
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-4 ml-auto"> {/* ml-auto pushes content to the right */}
        {mounted ? ( // Render only after mounted to prevent flicker
          <>
            <ThemeToggle />
            <LanguageSwitcher />
          </>
        ) : (
          // Skeletons for the toggles during hydration
          <>
            <div className="h-9 w-9 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="h-9 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </>
        )}
      </div>
    </header>
  );
}
