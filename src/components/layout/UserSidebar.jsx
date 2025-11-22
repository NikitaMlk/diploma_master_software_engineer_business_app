'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Bell,
  LifeBuoy, // For support
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar, // Assuming these are from your custom sidebar components
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarTrigger, // To be used in UserHeader for mobile
} from "@/components/ui/sidebar"; // Adjust path if necessary

export default function UserSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const t = useTranslations('userSidebar');

  // Function to get initials from user's name
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const navItems = [
    { label: t('overview'), icon: <LayoutDashboard size={18} />, href: `/dashboard/user/${session?.user?.id || 'me'}` },
    { label: t('settings'), icon: <Settings size={18} />, href: `/dashboard/user/${session?.user?.id || 'me'}/settings` },
    { label: t('billing'), icon: <CreditCard size={18} />, href: `/dashboard/user/${session?.user?.id || 'me'}/billing` },
    { label: t('notifications'), icon: <Bell size={18} />, href: `/dashboard/user/${session?.user?.id || 'me'}/notifications` },
    { label: t('support'), icon: <LifeBuoy size={18} />, href: `/dashboard/user/${session?.user?.id || 'me'}/support` },
  ];

  return (
    // The Sidebar component itself should handle its fixed/overlay positioning based on screen size
    <Sidebar className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={session?.user?.image || undefined} alt={`${session?.user?.name}'s avatar`} referrerPolicy="no-referrer" />
            <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-foreground truncate">{session?.user?.name || "Guest User"}</span>
            <span className="text-sm text-muted-foreground truncate">{session?.user?.email || "N/A"}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 py-4">
        <ScrollArea className="h-full">
          <SidebarGroup>
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={`w-full justify-start rounded-lg px-4 py-3 text-base ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
        >
          <LogOut size={18} className="mr-3" /> {t('logout')}
        </Button>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          {t('copyright', { year: new Date().getFullYear() })}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
