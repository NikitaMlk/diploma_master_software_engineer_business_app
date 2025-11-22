// 3. Pricing Plans Component (components/shared/PricingPlans.jsx)
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, Star, Zap, MessageSquare, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';

const PricingPlans = ({ currentPlan, onSelectPlan, loading }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 19,
      currency: 'USD',
      description: 'Perfect for getting started',
      popular: false,
      features: [
        { icon: MessageSquare, text: '100 posts per month' },
        { icon: Zap, text: '5 active campaigns' },
        { icon: Check, text: 'Basic templates' },
        { icon: Mail, text: 'Email support' }
      ],
      limits: {
        postsPerMonth: 100,
        campaigns: 5
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      currency: 'USD',
      description: 'For serious content creators',
      popular: true,
      features: [
        { icon: MessageSquare, text: 'Unlimited posts' },
        { icon: Zap, text: 'Unlimited campaigns' },
        { icon: Check, text: 'Advanced templates' },
        { icon: Shield, text: 'Priority support' },
        { icon: Star, text: 'Custom branding' }
      ],
      limits: {
        postsPerMonth: -1,
        campaigns: -1
      }
    }
  ];

  const handleSelectPlan = async (planId) => {
    setSelectedPlan(planId);
    try {
      await onSelectPlan(planId);
    } catch (error) {
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setSelectedPlan(null);
    }
  };

  const isCurrentPlan = (planId) => {
    return currentPlan === planId;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''} ${
            isCurrentPlan(plan.id) ? 'bg-green-50 dark:bg-green-900/10' : ''
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white">
                Most Popular
              </Badge>
            </div>
          )}
          
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-2xl">{plan.name}</span>
              {isCurrentPlan(plan.id) && (
                <Badge variant="secondary">Current</Badge>
              )}
            </CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">₴{plan.price}</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {plan.description}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <li key={index} className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm">{feature.text}</span>
                  </li>
                );
              })}
            </ul>
            
            <Button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={loading || selectedPlan === plan.id || isCurrentPlan(plan.id)}
              className="w-full"
              variant={plan.popular ? 'default' : 'outline'}
            >
              {loading && selectedPlan === plan.id ? (
                'Processing...'
              ) : isCurrentPlan(plan.id) ? (
                'Current Plan'
              ) : (
                `Select ${plan.name}`
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingPlans;