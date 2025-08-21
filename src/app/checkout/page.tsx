'use client';
import Image from "next/image";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import pricingPlans from "./pricingPlans.json";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

// ISO country codes that Dodo accepts
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'PT', name: 'Portugal' },
  { code: 'IE', name: 'Ireland' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' },
  { code: 'RU', name: 'Russia' },
  { code: 'CN', name: 'China' },
  { code: 'TH', name: 'Thailand' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'NZ', name: 'New Zealand' }
].sort((a, b) => a.name.localeCompare(b.name));

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [selectedCountry, setSelectedCountry] = useState('US'); // Default to US
  const plan = searchParams.plan as string;

  // Set page title and check payment status
  useEffect(() => {
    document.title = "The #1 AI Photo Generator";
    
    // Check if user has already paid
    const checkPaymentStatus = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: userData, error } = await supabase
            .from('userTable')
            .select('paymentStatus, workStatus')
            .eq('id', user.id)
            .single();
            
          if (!error && userData) {
            const paymentSuccessful = userData.paymentStatus && 
              ['SUCCESS', 'paid', 'completed', 'success'].includes(userData.paymentStatus.toLowerCase());
              
            if (paymentSuccessful) {
              console.log('✅ User has already paid, redirecting based on work status');
              
              const workStatus = (userData.workStatus || "").toLowerCase();
              switch (workStatus) {
                case "":
                case "null":
                case null:
                case undefined:
                  redirect("/upload/intro");
                  break;
                case "ongoing":
                  redirect("/wait");
                  break;
                case "completed":
                case "complete":
                  redirect("/dashboard");
                  break;
                default:
                  // Stay on checkout if work status is unclear
                  break;
              }
            }
          }
        }
      } catch (error) {
        console.warn('Error checking payment status:', error);
        // Continue with checkout page if there's an error
      }
    };
    
    checkPaymentStatus();
  }, []);

  if (
    !plan ||
    !["basic", "professional", "executive"].includes(plan.toLowerCase())
  ) {
    redirect("/forms");
  }

  const selectedPlan = pricingPlans.find(
    (p) => p.name.toLowerCase() === plan.toLowerCase()
  );

  if (!selectedPlan) {
    redirect("/forms");
  }

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePayment = async (plan: any) => {
    if (loading) return;
    
    // Validate country selection
    if (!selectedCountry) {
      setError('Please select your country before proceeding.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First test if the API key is valid
      const testRes = await fetch('/api/dodo/test');
      if (!testRes.ok) {
        const testData = await testRes.json();
        throw new Error(`API key test failed: ${testData.error || testRes.status}`);
      }
      
      // Create the payment with billing information
      const res = await fetch('/api/dodo/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          productId: plan.dodoProductId, 
          metadata: { plan: plan.planId },
          billing: {
            country: selectedCountry
          }
        }),
      });
      
      // Handle non-JSON responses (like empty body)
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server responded with status ${res.status}: ${text || 'No response body'}`);
      }
      
      if (!res.ok) {
        const msg = data?.error || 'Failed to create checkout';
        const details = typeof data?.details === 'string' ? data.details : JSON.stringify(data?.details);
        throw new Error(details ? `${msg}: ${details}` : msg);
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Checkout URL missing');
      }
    } catch (e: any) {
      const errorMessage = e.message || 'Payment init failed';
      console.error('Payment error:', errorMessage);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mainWhite text-mainBlack">
      <Header userAuth={true} />

      <main className="max-w-4xl mx-auto mt-8 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">
            Secure Checkout
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Join over hundreds of satisfied customers who&apos;ve created
            professional headshots with us.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">Payment Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">
              Select your preferred payment method
            </h2>

            <div className="border border-mainBlack rounded-lg p-4 mb-4 flex items-center">
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="creditCard"
                className="mr-3"
                checked={paymentMethod === 'creditCard'}
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="creditCard" className="flex-grow font-medium">
                Pay with credit card
              </label>
              <div className="flex gap-2">
                {["visa", "mastercard", "jcb"].map((card) => (
                  <Image
                    key={card}
                    src={`/creditcard/${card}.svg`}
                    alt={card}
                    width={32}
                    height={20}
                  />
                ))}
              </div>
            </div>

            {/* Country Selection */}
            <div className="mb-4">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Select your country <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mainBlack focus:border-transparent bg-white"
                required
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Required for payment processing. Your card will be accepted regardless of billing country.
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Got a coupon or discount? Enter it here.
            </p>

            {/* Trust indicators */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Secure checkout - SSL encrypted
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                Trusted by more than 100+ customers
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Done in 2 hours or less
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                8x cheaper than a photographer
              </div>
            </div>

            {/* Add structured data for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Product",
                  name: `${selectedPlan.name} AI Headshot Package`,
                  description: `${selectedPlan.headshots} headshots, Unique backgrounds, ${selectedPlan.time} hour turnaround time`,
                  offers: {
                    "@type": "Offer",
                    price: selectedPlan.price,
                    priceCurrency: "USD",
                  },
                }),
              }}
            />
          </div>

          {/* Right column */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-mainBlack">
                Order Summary
              </h2>

              <div className="mb-4">
                <p className="font-medium text-mainBlack">
                  1x {selectedPlan.name} Package
                </p>
                <ul className="text-sm text-mainBlack/70 ml-5 list-disc">
                  <li>{selectedPlan.headshots} headshots</li>
                  <li>Unique backgrounds</li>
                  <li>
                    {selectedPlan.time} hour{selectedPlan.time > 1 ? "s" : ""}{" "}
                    turnaround time
                  </li>
                </ul>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-mainBlack">
                  Original Price
                </span>
                <span className="text-lg line-through text-mainBlack/50">
                  ${selectedPlan.originalPrice}.00
                </span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-mainBlack">Discount</span>
                <span className="text-lg font-bold text-mainBlack">
                  {Math.round(
                    (1 - selectedPlan.price / selectedPlan.originalPrice) * 100
                  )}
                  % OFF
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-mainBlack">Total</span>
                <span className="text-2xl font-bold text-mainBlack">
                  ${selectedPlan.price}.00
                </span>
              </div>

              <button 
                onClick={() => handlePayment(selectedPlan)}
                className="w-full bg-mainBlack text-mainWhite py-3 rounded-md font-medium hover:bg-mainBlack/90 transition-colors mb-4"
                disabled={loading}
              >
                {loading ? 'Redirecting…' : 'Pay now'}
              </button>

              <div className="relative group">
                <p className="text-center text-sm text-mainBlack font-medium mb-2 cursor-help">
                  30-DAY MONEY BACK GUARANTEE
                </p>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-mainWhite border border-mainBlack rounded shadow-md text-xs text-mainBlack w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  If you&apos;re not satisfied with our service and haven&apos;t
                  downloaded the generated images, we offer refund within
                  30 days of your purchase.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
