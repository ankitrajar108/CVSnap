import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'Dodo webhook endpoint is working!',
    timestamp: new Date().toISOString(),
    url: req.url
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    console.log('Webhook test received:', body);
    
    return NextResponse.json({ 
      success: true,
      message: 'Test webhook received',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
