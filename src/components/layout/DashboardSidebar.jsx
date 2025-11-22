"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // To highlight active link
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"; // Assuming these are your custom shadcn-like sidebar components
import { Button } from "@/components/ui/button"; // Shadcn Button component
import { ScrollArea } from "@/components/ui/scroll-area"; // For scrollable content
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  CreditCard,
  PlusCircle,
  Settings,
  Package, // For Product/Subscription Plans
  Brush
} from "lucide-react"; // Icons for the menu items
import { useTranslations } from "next-intl"; // For internationalization

export default function DashboardSidebar() {
  const t = useTranslations('dashboardSidebar'); // Assuming a translation namespace for sidebar
  const pathname = usePathname(); // Get current path to highlight active links

  const navItems = [
    {
      label: t('overview'), // Translated "Overview"
      icon: <LayoutDashboard size={18} />,
      href: "/dashboard",
    },
    {
      label: t('users'), // Translated "Users"
      icon: <Users size={18} />,
      href: "/dashboard/users",
    },
    {
      label: t('blog'), // Translated "Blog"
      icon: <FileText size={18} />,
      href: "/dashboard/blog",
    },
    {
      label: t('mailing'), // Translated "Mailing"
      icon: <Mail size={18} />,
      href: "/dashboard/mail",
    },
    {
      label: t('payments'), // Translated "Payments"
      icon: <CreditCard size={18} />,
      href: "/dashboard/payments",
    },
    {
      label: t('products'), // Translated "Products" (or Subscription Plans)
      icon: <Package size={18} />,
      href: "/dashboard/product",
    },
    {
      label: t('createAdmin'), // Translated "Create Admin"
      icon: <PlusCircle size={18} />,
      href: "/dashboard/create-admin",
    },
        {
      label: t('theme'), // Translated "Theme"
      icon: <Brush size={18} />,
      href: "/dashboard/theme",
    },
    {
      label: t('settings'), // Translated "Settings"
      icon: <Settings size={18} />,
      href: "/dashboard/settings",
    },
  ];

  return (
    <Sidebar className="flex flex-col h-full bg-background border-r border-primary shadow-lg">
      <SidebarHeader className="p-4 border-b border-primary">
        {/* Your Brand/Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-extrabold text-accent">
          <LayoutDashboard size={28} /> Admin Dashboard
        </Link>
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
                    ? "bg-accent text-primary-foreground hover:bg-primary"
                    : "text-primary hover:bg-accent"
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

      <SidebarFooter className="p-4 border-t border-primary">
        <div className="text-sm text-primary text-center">
          © {new Date().getFullYear()} Your Company
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
