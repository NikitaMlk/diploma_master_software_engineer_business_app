'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  FileText,
  Settings,
  Mail,
  CreditCard,
  PlusCircle,
  Power,
  DollarSign, // Added for Revenue
  Package // Alternative for Subscription Plans/Product
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // For loading states
import RollingNumber from '@/components/shared/RollingNumber';

import QuickAccessButtons from '@/components/shared/QuickAccessButtons';

export default function AdminDashboard() {
  const t = useTranslations('dashboard');
  const router = useRouter();

  // State to hold the final fetched stats
  const [stats, setStats] = useState({
    users: 0, // Initialize to 0 for rolling animation
    revenue: 0, // Initialize to 0 for rolling animation
    transactions: 0, // Initialize to 0 for rolling animation
    appVersion: '---', // App version doesn't roll, so keep as string
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true); // Control loading state for stats

  useEffect(() => {
    async function fetchData() {
      setIsLoadingStats(true); // Start loading state
      try {
        const [userRes, revenueRes, transactionsRes] = await Promise.all([
          fetch('/api/users/count'),
          fetch('/api/transactions/total'),
          fetch('/api/transactions/count'),
        ]);

        const [userData, revenueData, transactionsData] = await Promise.all([
          userRes.ok ? userRes.json() : Promise.reject(new Error("Failed to fetch user count")),
          revenueRes.ok ? revenueRes.json() : Promise.reject(new Error("Failed to fetch revenue")),
          transactionsRes.ok ? transactionsRes.json() : Promise.reject(new Error("Failed to fetch transactions")),
        ]);

        // Set the stats to their fetched numeric values
        setStats({
          users: userData.count ?? 0,
          revenue: Number(revenueData.total || 0), // Keep as number for rolling
          transactions: transactionsData.count ?? 0,
          appVersion: 'v0.0.8', // Static version string
        });
      } catch (error) {
        console.error('Dashboard stat load error:', error);
        // On error, set a default non-rolling display or 'Error'
        setStats({
          users: 'Error',
          revenue: 'Error',
          transactions: 'Error',
          appVersion: 'Error',
        });
      } finally {
        // Set loading to false after a slight delay to allow animation to start from 0
        // Or, more simply, the RollingNumber component will handle its own animation.
        // We set isLoadingStats to false once data is *ready to be animated*.
        setIsLoadingStats(false); 
      }
    }

    fetchData();
  }, []);

  const actions = [
    { icon: <User size={18} />, label: "Manage Users", path: "/dashboard/users" },
    { icon: <FileText size={18} />, label: "Manage Blog Posts", path: "/dashboard/blog" },
    { icon: <Mail size={18} />, label: "Mailing System", path: "/dashboard/mailing" },
    { icon: <CreditCard size={18} />, label: "Payment Settings", path: "/dashboard/payments" },
    { icon: <PlusCircle size={18} />, label: "Create Admin User", path: "/dashboard/create-admin" },
    { icon: <Package size={18} />, label: "Subscription Plans", path: "/dashboard/product" },
    { icon: <Settings size={18} />, label: "Maintenance Mode", path: "/dashboard/settings" },
  ];

  return (
    <section className="min-h-screen bg-background p-6 md:p-8 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-bold text-foreground">{t('welcome')}</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage your application</p>
        </div>

        <QuickAccessButtons />

        {/* Stat Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <Card className="border-border bg-card hover:bg-card/80 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User size={18} className="text-primary" /> 
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-24 bg-muted" />
              ) : (
                <div className="text-2xl font-bold text-card-foreground">
                  <RollingNumber value={stats.users} duration={1500} decimals={0} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:bg-card/80 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign size={18} className="text-primary" /> 
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-32 bg-muted" />
              ) : (
                <div className="text-2xl font-bold text-card-foreground">
                  <RollingNumber value={stats.revenue} duration={2000} prefix="$" isCurrency />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:bg-card/80 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText size={18} className="text-primary" /> 
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20 bg-muted" />
              ) : (
                <div className="text-2xl font-bold text-card-foreground">
                  <RollingNumber value={stats.transactions} duration={1500} decimals={0} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:bg-card/80 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Settings size={18} className="text-primary" /> 
                App Version
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20 bg-muted" />
              ) : (
                <div className="text-2xl font-bold text-card-foreground">{stats.appVersion}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {actions.map(({ icon, label, path }) => (
              <Button
                key={label}
                variant="secondary"
                onClick={() => router.push(path)}
                className="justify-start gap-3 h-auto p-4 text-left border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="text-primary">{icon}</div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}