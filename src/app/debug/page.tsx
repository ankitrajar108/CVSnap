'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApiKey = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dodo/test');
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dodo API Debug</h1>
        
        <button 
          onClick={testApiKey}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Key'}
        </button>
        
        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="bg-gray-800 text-green-400 p-6 rounded-lg overflow-auto max-h-96 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Make sure your API key is from the correct environment (test vs live)</li>
            <li>Verify your API key is active in your Dodo dashboard</li>
            <li>Check if your Dodo account is properly verified</li>
            <li>Ensure the product IDs in your pricing plans exist in your Dodo account</li>
            <li>Try generating a new API key from your Dodo dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
