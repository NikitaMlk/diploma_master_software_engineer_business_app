'use client';

import { useState } from 'react';

export default function PayButton({
  productId,
  userEmail,
  paymentProvider = "stripe", // 'stripe' or 'lemonsqueezy'
  children = 'Pay Now'
}) {
  const [loading, setLoading] = useState(false);

  async function pay() {
    if (!userEmail && paymentProvider === 'stripe') {
      alert('Please log in to proceed with payment.');
      return;
    }

    try {
      setLoading(true);

      let endpoint = null;

      if (paymentProvider === 'stripe') {
        endpoint = '/api/payments/stripe/checkout';
      } else if (paymentProvider === 'lemonsqueezy') {
        endpoint = '/api/payments/lemonsqueezy/checkout';
      } else {
        throw new Error(`Unsupported payment provider: ${paymentProvider}`);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, productId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error(data.error);
        alert('Payment failed. ' + (data.error || 'Please try again.'));
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={pay}
      disabled={loading}
      className={`transition px-6 py-3 rounded-xl font-semibold text-white
        ${loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-[#4CAF50] hover:bg-[#43A047]'}
      `}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
}
