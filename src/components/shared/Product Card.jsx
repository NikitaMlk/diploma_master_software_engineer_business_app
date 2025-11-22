'use client';

import { useState } from 'react';

export default function ProductCard({ product, userEmail }) {
  const [loading, setLoading] = useState(false);

  async function pay() {
    if (!userEmail) {
      alert('Please log in to proceed to payment.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/payments/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: userEmail,
          productId: product._id,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error(data.error);
        alert('Payment failed: ' + data.error);
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm p-4 border rounded shadow mb-4">
      <h2 className="text-lg font-bold mb-1">{product.name}</h2>
      <p className="mb-2 text-sm text-gray-600">{product.description}</p>
      <p className="text-green-600 font-semibold mb-4">
        ${(product.price / 100).toFixed(2)}
      </p>
      <button
        onClick={pay}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
