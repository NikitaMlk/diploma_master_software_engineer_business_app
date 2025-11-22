// 2. Usage Tracking Component (components/shared/UsageTracker.jsx)
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { BarChart3, MessageSquare, Zap } from 'lucide-react';

const UsageTracker = ({ usage, subscription }) => {
  const { postsThisMonth = 0, campaignsActive = 0, limits = {} } = usage || {};
  const { postsPerMonth = -1, campaigns = -1 } = limits;

  const calculateUsagePercentage = (used, limit) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatLimit = (limit) => (limit === -1 ? 'Unlimited' : limit.toLocaleString());

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Usage This Month</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Posts Generated</span>
            </div>
            <span className="text-sm text-gray-600">
              {postsThisMonth.toLocaleString()} / {formatLimit(postsPerMonth)}
            </span>
          </div>
          {postsPerMonth !== -1 && (
            <Progress value={calculateUsagePercentage(postsThisMonth, postsPerMonth)} className="h-2" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Active Campaigns</span>
            </div>
            <span className="text-sm text-gray-600">
              {campaignsActive.toLocaleString()} / {formatLimit(campaigns)}
            </span>
          </div>
          {campaigns !== -1 && (
            <Progress value={calculateUsagePercentage(campaignsActive, campaigns)} className="h-2" />
          )}
        </div>

        {postsPerMonth !== -1 && postsThisMonth >= postsPerMonth * 0.9 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ You're approaching your monthly post limit. Consider upgrading your plan.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageTracker;