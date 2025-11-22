// config/plans.js
export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 19, // UAH
    currency: 'USD',
    interval: 'month',
    features: [
      '5 campaigns per month',
      '50 posts per month',
      '100 emails per month',
      'Basic support'
    ],
    limits: {
      campaigns: 5,
      posts: 50,
      emails: 100
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    price: 29, // UAH
    currency: 'USD',
    interval: 'month',
    features: [
      '50 campaigns per month',
      '1000 posts per month',
      '2000 emails per month',
      'Priority support',
      'Advanced analytics'
    ],
    limits: {
      campaigns: 50,
      posts: 1000,
      emails: 2000
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 999, // UAH
    currency: 'UAH',
    interval: 'month',
    features: [
      'Unlimited campaigns',
      'Unlimited posts',
      'Unlimited emails',
      '24/7 support',
      'Advanced analytics',
      'Custom integrations'
    ],
    limits: {
      campaigns: -1, // unlimited
      posts: -1,     // unlimited
      emails: -1     // unlimited
    }
  }
};

export default SUBSCRIPTION_PLANS;