'use client';

import { ArrowLeft, LogOut, User as UserIcon, FileText, Mail, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; // Import useSession
import DarkModeToggle from '../shared/ThemeToggle';
import LanguageSwitcher from '../../app/(dashboard)/dashboard/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardHeader() {
  const t = useTranslations('dashboardHeader');
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession(); // Get both data (session) and status

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Function to get initials from user's name
  const getInitials = (name) => {
    if (!name) return "AV"; // Default to "AV" if no name
    const parts = name.split(' ').filter(Boolean); // Filter out empty strings from multiple spaces
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    // Get first character of first and last name part
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const userInitials = getInitials(session?.user?.name);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background border-b border-border shadow-sm backdrop-blur-sm">
      {/* Left side: back button */}
      <div className="flex items-center gap-4">
        <Button 
          asChild 
          variant="outline" 
          className="inline-flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('backToSite')}</span>
          </Link>
        </Button>
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3">
          <DarkModeToggle />
          <LanguageSwitcher />
        </div>

        {/* User Avatar and Dropdown Menu */}
        {status === 'loading' ? (
          // Show a skeleton/pulse during loading to prevent 'AV' flicker
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
                <Avatar className="h-10 w-10">
                  {/* AvatarImage loads the user's image */}
                  {/* Added referrerPolicy="no-referrer" to help with loading Google avatars */}
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    alt={session?.user?.name ? `${session.user.name}'s avatar` : "User avatar"}
                    referrerPolicy="no-referrer"
                  />
                  {/* AvatarFallback shows initials or default if image fails or is not present */}
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-card border-border shadow-lg" 
              align="end" 
              forceMount
              sideOffset={8}
            >
              {session?.user?.name && (
                <DropdownMenuItem className="flex flex-col items-start px-4 py-3 focus:bg-accent focus:text-accent-foreground">
                  <div className="font-medium text-sm text-card-foreground">{session.user.name}</div>
                  <div className="text-xs text-muted-foreground truncate w-full">{session.user.email}</div>
                </DropdownMenuItem>
              )}
              {session?.user?.name && <DropdownMenuSeparator className="bg-border" />}
              
              {/* Mobile-only theme and language controls */}
              <div className="sm:hidden">
                <DropdownMenuItem className="px-4 py-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-card-foreground">Theme & Language</span>
                    <div className="flex items-center gap-2">
                      <DarkModeToggle />
                      <LanguageSwitcher />
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
              </div>

              <DropdownMenuItem asChild>
                <Link href="/dashboard/users" className="flex items-center gap-3 px-4 py-2 text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <UserIcon className="w-4 h-4 text-primary" /> 
                  <span>{t('users')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/blog" className="flex items-center gap-3 px-4 py-2 text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <FileText className="w-4 h-4 text-primary" /> 
                  <span>{t('blog')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/mailing" className="flex items-center gap-3 px-4 py-2 text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Mail className="w-4 h-4 text-primary" /> 
                  <span>{t('emails')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Settings className="w-4 h-4 text-primary" /> 
                  <span>{t('settings')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4" /> 
                <span>{t('logout') || 'Logout'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}