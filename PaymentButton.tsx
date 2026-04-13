import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';
import { stripeProducts } from '../stripe-config';
import { useAuth } from '../lib/auth';
import { Alert } from './ui/Alert';

interface PaymentButtonProps {
  onPaymentRequired?: () => void;
  className?: string;
}

export function PaymentButton({ onPaymentRequired, className = '' }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const product = stripeProducts[0]; // FixMyProblem Letter Unlock

  const handlePayment = async () => {
    if (!user) {
      onPaymentRequired?.();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { url } = await createCheckoutSession({
        price_id: product.priceId,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: window.location.href,
        mode: product.mode,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
        ) : (
          <CreditCard className="h-5 w-5 mr-2" />
        )}
        {loading ? 'Processing...' : `Unlock Letter - ${product.currencySymbol}${product.price}`}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        {product.description}
      </p>
    </div>
  );
}