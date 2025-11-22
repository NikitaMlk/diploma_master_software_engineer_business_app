// 1. Subscription Status Component (components/shared/SubscriptionStatus.jsx)
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

const SubscriptionStatus = ({ subscription, trialDaysLeft, onUpgrade }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      free_trial: { color: 'bg-blue-500', icon: Clock, text: 'Free Trial' },
      active: { color: 'bg-green-500', icon: CheckCircle, text: 'Active' },
      canceled: { color: 'bg-red-500', icon: AlertTriangle, text: 'Canceled' },
      expired: { color: 'bg-gray-500', icon: AlertTriangle, text: 'Expired' }
    };

    const config = statusConfig[status] || statusConfig.expired;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('uk-UA');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Subscription Status</span>
          {getStatusBadge(subscription.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription.status === 'free_trial' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                  Free Trial Active
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {trialDaysLeft > 0 
                    ? `${trialDaysLeft} days remaining`
                    : 'Trial expires today'
                  }
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  Trial ends: {formatDate(subscription.trialEndDate)}
                </p>
              </div>
            </div>
            
            {trialDaysLeft <= 3 && (
              <div className="mt-3">
                <Button onClick={onUpgrade} className="w-full" size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            )}
          </div>
        )}

        {subscription.status === 'active' && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-300">
                  {subscription.plan === 'basic' ? 'Basic Plan' : 'Pro Plan'}
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Next payment: {formatDate(subscription.nextPaymentDate)}
                </p>
                {subscription.lastPaymentDate && (
                  <p className="text-xs text-green-500 mt-1">
                    Last payment: {formatDate(subscription.lastPaymentDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {(subscription.status === 'expired' || subscription.status === 'canceled') && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-300">
                  Subscription {subscription.status === 'expired' ? 'Expired' : 'Canceled'}
                </h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Renew your subscription to continue using all features
                </p>
              </div>
            </div>
            <Button onClick={onUpgrade} className="w-full mt-3" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Renew Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;