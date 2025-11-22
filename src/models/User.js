// 4. User Model Extension (models/User.js)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // ... existing fields
  
  // Subscription fields
  subscription: {
    status: {
      type: String,
      enum: ['free_trial', 'active', 'canceled', 'expired'],
      default: 'free_trial'
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro'],
      default: 'free'
    },
    trialStartDate: {
      type: Date,
      default: Date.now
    },
    trialEndDate: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      }
    },
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    liqpaySubscriptionId: String,
    lastPaymentDate: Date,
    nextPaymentDate: Date
  },
  
  // Payment history
  payments: [{
    liqpayOrderId: String,
    amount: Number,
    currency: String,
    status: String,
    date: { type: Date, default: Date.now },
    plan: String
  }]
}, {
  timestamps: true
});

// Method to check if user is in trial
userSchema.methods.isInTrial = function() {
  return this.subscription.status === 'free_trial' && 
         new Date() < this.subscription.trialEndDate;
};

// Method to check if subscription is active
userSchema.methods.hasActiveSubscription = function() {
  return this.subscription.status === 'active' && 
         new Date() < this.subscription.subscriptionEndDate;
};

// Method to check if user has access
userSchema.methods.hasAccess = function() {
  return this.isInTrial() || this.hasActiveSubscription();
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);