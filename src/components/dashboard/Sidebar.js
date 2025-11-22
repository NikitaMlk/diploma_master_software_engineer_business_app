"use client";

import React from 'react';
import { Twitter, Home, Calendar, BarChart3, Brain, Target, LogOut, User, ChevronUp } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AppSidebar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { setOpen } = useSidebar();

  // Extract userId from the current path
  const userId = session?.user?.id;

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null, path: `/u/${userId}` },
    { id: 'generate', icon: Brain, label: 'Content Generator', badge: 'Featured', path: `/u/${userId}/calendar` },
    { id: 'schedule', icon: Calendar, label: 'Scheduler', badge: null, path: `/u/${userId}/schedule` },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: null, path: `/u/${userId}/analytics` },
    { id: 'voice', icon: Target, label: 'Voice Training', badge: null, path: `/u/${userId}/voice` }
  ];

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: '/auth/signin',
        redirect: true
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleProfileClick = () => {
    router.push(`/u/${userId}/subscription`);
  };

  const handleNavigation = (path) => {
    router.push(path);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  // Check if current path is active
  const isActiveItem = (itemPath) => {
    if (itemPath === `/u/${userId}`) {
      // For dashboard, check exact match or if we're at the base user path
      return pathname === itemPath || pathname === `/u/${userId}`;
    }
    return pathname === itemPath;
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get subscription status display
  const getSubscriptionStatus = () => {
    if (session?.user?.subscription) {
      const sub = session.user.subscription;
      if (sub.status === 'active') {
        return sub.plan?.name || 'Pro';
      } else if (sub.status === 'trialing') {
        return 'Free Trial';
      } else if (sub.status === 'canceled' || sub.status === 'past_due') {
        return 'Expired';
      }
    }
    return 'Free Trial';
  };

  const getSubscriptionColor = () => {
    const status = getSubscriptionStatus();
    if (status.includes('Pro') || status.includes('Premium')) {
      return 'text-green-400';
    } else if (status.includes('Trial')) {
      return 'text-blue-400';
    } else if (status.includes('Expired')) {
      return 'text-red-400';
    }
    return 'text-muted-foreground';
  };

  if (status === 'loading') {
    return (
      <Sidebar>
        <SidebarContent className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (!session || !userId) {
    return null;
  }

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Twitter className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">X Scheduler</h1>
            <p className="text-sm text-muted-foreground">AI Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.path)}
                    isActive={isActiveItem(item.path)}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto p-3">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image} />
                        <AvatarFallback className="text-sm">
                          {getUserInitials(session.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online status indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">
                        {session.user.name || 'User'}
                      </p>
                      <p className={`text-xs ${getSubscriptionColor()}`}>
                        {getSubscriptionStatus()}
                      </p>
                    </div>
                    <ChevronUp className="h-4 w-4 ml-auto" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-56"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* Additional user info */}
        {(session.user.loginCount || session.user.role) && (
          <div className="px-3 pb-2">
            <div className="text-xs text-muted-foreground space-y-1">
              {session.user.role && session.user.role !== 'user' && (
                <div className="text-yellow-500 capitalize">
                  {session.user.role}
                </div>
              )}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;