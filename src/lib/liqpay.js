// lib/liqpay.js - CORRECTED VERSION BASED ON OFFICIAL DOCUMENTATION
import CryptoJS from 'crypto-js';

class LiqPay {
  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.apiUrl = 'https://www.liqpay.ua/api/';
  }

  cnbData(params) {
    return Buffer.from(JSON.stringify(params)).toString('base64');
  }

  cnbSignature(data) {
    const signString = this.privateKey + data + this.privateKey;
    // FIXED: Generate SHA1 as raw binary then base64 encode
    const hash = CryptoJS.SHA1(signString);
    return CryptoJS.enc.Base64.stringify(hash);
  }

  // CORRECTED: Subscription form generator based on official docs
  createSubscription(params) {
    console.log('🔧 Input params for subscription:', params);

    // Date format as per documentation: 2015-03-31 00:00:00
    const now = new Date();
    const subscribeDate = now.toISOString().slice(0, 19).replace('T', ' ');
    
    console.log('📅 Generated subscribe_date_start:', subscribeDate);

    const defaultParams = {
      version: 3, // REVERTED: Back to version 3 like your working example
      public_key: this.publicKey,
      action: 'subscribe',
      
      // FIXED: Required subscription parameters according to docs
      subscribe: '1', // This IS required according to documentation
      subscribe_date_start: subscribeDate,
      subscribe_periodicity: 'month',
      
      // Default values
      currency: 'USD',
      language: 'en',
      
      // Note: phone and ip are required but will be added from params
      // Card details are also required but should come from the payment form
    };

    // Merge with provided parameters
    const paymentParams = { ...defaultParams, ...params };
    
    // VALIDATION: Check required fields according to documentation
    const requiredFields = ['amount', 'description', 'order_id', 'phone'];
    const missingFields = requiredFields.filter(field => !paymentParams[field]);
    
    if (missingFields.length > 0) {
      console.warn(`⚠️ Missing recommended fields for subscription: ${missingFields.join(', ')}`);
      console.log('ℹ️ Note: phone and ip are required by LiqPay but can be collected in payment form');
    }

    // Convert amount to string format (like in your working example)
    if (paymentParams.amount) {
      paymentParams.amount = parseFloat(paymentParams.amount).toString();
    }

    console.log('🔧 Final subscription parameters:', JSON.stringify(paymentParams, null, 2));
    
    const data = this.cnbData(paymentParams);
    const signature = this.cnbSignature(data);

    console.log('✅ Generated data length:', data.length);
    console.log('✅ Generated signature length:', signature.length);

    return `
      <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
      </form>
    `;
  }

  // Method for one-time payments
  createPayment(params) {
    const defaultParams = {
      version: 3, // REVERTED: Back to version 3
      public_key: this.publicKey,
      action: 'pay',
      currency: 'USD',
      language: 'en',
    };

    const paymentParams = { ...defaultParams, ...params };
    
    const requiredFields = ['amount', 'description', 'order_id'];
    const missingFields = requiredFields.filter(field => !paymentParams[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Convert amount to string format
    paymentParams.amount = parseFloat(paymentParams.amount).toString();
    
    const data = this.cnbData(paymentParams);
    const signature = this.cnbSignature(data);

    return `
      <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
      </form>
    `;
  }

  verifyCallback(data, signature) {
    return this.cnbSignature(data) === signature;
  }

  decodeData(data) {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
  }

  // Direct API call for subscriptions (server-to-server)
  async createSubscriptionDirect(params) {
    try {
      const defaultParams = {
        version: 3,
        public_key: this.publicKey,
        action: 'subscribe',
        subscribe: '1',
        subscribe_periodicity: 'month',
        currency: 'USD',
        language: 'en',
      };

      const subscriptionParams = { ...defaultParams, ...params };

      // Ensure amount is a string (like your working example)
      if (subscriptionParams.amount) {
        subscriptionParams.amount = parseFloat(subscriptionParams.amount).toString();
      }

      // Set subscribe_date_start if not provided
      if (!subscriptionParams.subscribe_date_start) {
        const now = new Date();
        subscriptionParams.subscribe_date_start = now.toISOString().slice(0, 19).replace('T', ' ');
      }

      const data = this.cnbData(subscriptionParams);
      const signature = this.cnbSignature(data);

      const response = await fetch(`${this.apiUrl}request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`
      });

      const result = await response.json();
      console.log('🔄 Direct subscription API response:', result);
      
      return result;
    } catch (error) {
      console.error('Error creating direct subscription:', error);
      throw error;
    }
  }

  // Method to check subscription status
  async checkSubscription(orderId) {
    try {
      const params = {
        version: 3,
        public_key: this.publicKey,
        action: 'status',
        order_id: orderId
      };

      const data = this.cnbData(params);
      const signature = this.cnbSignature(data);

      const response = await fetch(`${this.apiUrl}request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`
      });

      return await response.json();
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  }
}

export default new LiqPay(
  process.env.LIQPAY_PUBLIC_KEY,
  process.env.LIQPAY_PRIVATE_KEY
);