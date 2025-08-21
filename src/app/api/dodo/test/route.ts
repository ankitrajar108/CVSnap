import { NextRequest, NextResponse } from 'next/server';
import { dodopayments } from "@/lib/dodopayments";

export async function GET(req: NextRequest) {
  try {
    console.log('Testing Dodo API connection...');
    
    // Test the API by fetching products
    const products = await dodopayments.products.list();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Dodo API key is valid and working!',
      productCount: products.items?.length || 0,
      products: products.items
    });
    
  } catch (error: any) {
    console.error('Dodo API test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Dodo API test failed',
      message: error.message || String(error),
      details: error
    }, { status: 500 });
  }
}
