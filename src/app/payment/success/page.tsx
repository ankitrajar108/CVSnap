'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/Header";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string>('processing');
  const [paymentId, setPaymentId] = useState<string>('');

  useEffect(() => {
    const status = searchParams.get('status');
    const id = searchParams.get('payment_id');
    
    if (status && id) {
      setPaymentStatus(status);
      setPaymentId(id);
      
      // If payment succeeded, redirect to the next step
      if (status === 'succeeded') {
        setTimeout(() => {
          router.push('/upload/styles');
        }, 3000);
      }
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-mainWhite">
      <Header userAuth={true} />
      
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center">
          {paymentStatus === 'succeeded' ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4">
                <svg className="w-full h-full text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your payment has been processed successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700">
                  <strong>Payment ID:</strong> {paymentId}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Status:</strong> {paymentStatus}
                </p>
              </div>
              <p className="text-gray-500 text-sm">
                Redirecting to your dashboard in a few seconds...
              </p>
            </>
          ) : paymentStatus === 'cancelled' ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4">
                <svg className="w-full h-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
              <p className="text-gray-600 mb-6">
                Your payment was cancelled. You can try again if you wish.
              </p>
              <button 
                onClick={() => router.push('/checkout')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              </div>
              <h1 className="text-2xl font-bold text-gray-600 mb-4">Processing Payment...</h1>
              <p className="text-gray-500">
                Please wait while we confirm your payment.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
