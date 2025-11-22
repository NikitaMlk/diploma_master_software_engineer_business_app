// app/(user-dashboard)/u/[userId]/subscription/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import SubscriptionStatus from '@/components/shared/SubscriptionStatus';
import UsageTracker from '@/components/shared/UsageTracker';
import PricingPlans from '@/components/shared/PricingPlans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchSubscriptionData();
      fetchUsageData();
    }
  }, [session]);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/users/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      } else {
        console.error('Failed to fetch subscription data:', response.status);
      }
    } catch (error) {
      console.error('Subscription data fetch error:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/users/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      } else {
        console.error('Failed to fetch usage data:', response.status);
      }
    } catch (error) {
      console.error('Failed to load usage data:', error);
    }
  };

  const handleUpgrade = () => {
    // Scroll to plans section
    document.getElementById('pricing-plans')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleSelectPlan = async (planId) => {
    console.log('🚀 Starting payment for plan:', planId);
    
    if (!session?.user) {
      toast.error('Please log in to continue');
      return;
    }

    setPaymentLoading(true);
    try {
      console.log('📞 Calling checkout API...');
      
      const response = await fetch('/api/payments/liqpay/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      // Parse response - this will always succeed even if empty
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok) {
        if (data.paymentForm) {
          console.log('✅ Payment form received, submitting...');
          
          // Create temporary div and submit form
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = data.paymentForm;
          tempDiv.style.display = 'none';
          document.body.appendChild(tempDiv);
          
          const form = tempDiv.querySelector('form');
          if (form) {
            form.submit();
          } else {
            throw new Error('No form found in payment response');
          }
        } else {
          throw new Error('No payment form received');
        }
      } else {
        console.error('❌ Checkout API failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        
        const errorMessage = data?.error || data?.details || 'Payment initialization failed';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('💥 Payment error:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to initialize payment. Please try again.';
      
      if (error.message.includes('Unauthorized')) {
        errorMessage = 'Please log in to continue with payment.';
      } else if (error.message.includes('Invalid plan')) {
        errorMessage = 'Invalid subscription plan selected.';
      } else if (error.message.includes('User not found')) {
        errorMessage = 'User account not found. Please refresh and try again.';
      } else if (error.message.includes('configuration')) {
        errorMessage = 'Payment system temporarily unavailable. Please try again later.';
      }
      
      toast.error(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Please log in to view your subscription.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your subscription and view usage statistics
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subscriptionData && (
              <SubscriptionStatus
                subscription={subscriptionData.subscription}
                trialDaysLeft={subscriptionData.trialDaysLeft}
                onUpgrade={handleUpgrade}
              />
            )}
            
            {usage && subscriptionData && (
              <UsageTracker
                usage={usage}
                subscription={subscriptionData.subscription}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div id="pricing-plans">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Choose Your Plan
            </h2>
            <PricingPlans
              currentPlan={subscriptionData?.subscription?.plan}
              onSelectPlan={handleSelectPlan}
              loading={paymentLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Payment history content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}