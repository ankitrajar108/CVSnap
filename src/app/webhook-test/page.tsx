'use client';

import { useState } from 'react';

export default function WebhookTestPage() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  const testWebhook = async () => {
    try {
      const response = await fetch('/api/dodo/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'webhook-id': 'test_id',
          'webhook-timestamp': Math.floor(Date.now() / 1000).toString(),
          'webhook-signature': 'test_signature'
        },
        body: JSON.stringify({
          type: 'payment.succeeded',
          data: {
            payment_id: 'test_payment_123',
            total_amount: 2900,
            metadata: {
              user_id: 'test_user_id',
              plan: 'basic'
            }
          }
        })
      });
      
      const result = await response.json();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({ error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Webhook Configuration</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Setting up Dodo Webhook</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Step 1: Get your webhook URL</h3>
              <p className="text-blue-700 text-sm">
                Your webhook URL should be: <code className="bg-blue-100 px-2 py-1 rounded">https://your-ngrok-url.ngrok.io/api/dodo/webhook</code>
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Step 2: Configure in Dodo Dashboard</h3>
              <ol className="text-green-700 text-sm space-y-1 list-decimal list-inside">
                <li>Go to your Dodo Payments dashboard</li>
                <li>Navigate to Settings → Webhooks</li>
                <li>Click &quot;Add Webhook&quot;</li>
                <li>Enter your webhook URL</li>
                <li>Select &quot;payment.succeeded&quot; event</li>
                <li>Save the webhook</li>
              </ol>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Step 3: Test the webhook</h3>
              <p className="text-yellow-700 text-sm mb-3">
                Click the button below to test the webhook locally:
              </p>
              <button 
                onClick={testWebhook}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Test Webhook
              </button>
            </div>
          </div>
        </div>

        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Test Result:</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Payment Flow Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
              <span>User clicks &quot;Pay Now&quot; on checkout page</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
              <span>Payment link is created via Dodo API with user metadata</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</div>
              <span>User completes payment on Dodo checkout page</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">4</div>
              <span>Dodo sends webhook to your endpoint with payment success</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">5</div>
              <span>Your webhook updates userTable with payment info</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">6</div>
              <span>User is redirected back to your success page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
