// 9. Subscription check utility (lib/subscriptionUtils.js)
import User from '../models/User';
import { connectToDatabase } from './mongodb';

export async function checkUserAccess(userId) {
  await connectToDatabase();
  const user = await User.findById(userId);
  
  if (!user) {
    return { hasAccess: false, reason: 'user_not_found' };
  }

  if (user.hasAccess()) {
    return { 
      hasAccess: true, 
      subscription: user.subscription,
      isInTrial: user.isInTrial(),
      trialDaysLeft: user.isInTrial() ? 
        Math.ceil((user.subscription.trialEndDate - new Date()) / (1000 * 60 * 60 * 24)) : 0
    };
  }

  return { 
    hasAccess: false, 
    reason: user.subscription.status === 'free_trial' ? 'trial_expired' : 'subscription_expired',
    subscription: user.subscription
  };
}

export async function getUserUsage(userId, period = 'current_month') {
  await connectToDatabase();
  
  // This would connect to your campaigns/posts data
  // Return current usage statistics
  const user = await User.findById(userId);
  const plan = user.subscription.plan;
  
  // Calculate usage based on your Campaign model
  // This is a placeholder - implement based on your data structure
  
  return {
    postsThisMonth: 0, // Calculate actual usage
    campaignsActive: 0, // Calculate actual usage
    limits: SUBSCRIPTION_PLANS[plan]?.limits || { postsPerMonth: 0, campaigns: 0 }
  };
}