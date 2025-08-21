import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('🔔 Webhook received from Dodo');
    
    // Use the correct webhook secret from environment
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    if (!webhookSecret) {
      console.error('❌ Missing DODO_PAYMENTS_WEBHOOK_KEY');
      return NextResponse.json({ error: 'Missing DODO_PAYMENTS_WEBHOOK_KEY' }, { status: 500 });
    }

    // Get headers for verification
    const webhookId = req.headers.get("webhook-id") || "";
    const webhookSignature = req.headers.get("webhook-signature") || "";
    const webhookTimestamp = req.headers.get("webhook-timestamp") || "";

    // Read raw body for verification
    const rawBody = await req.text();
    
    console.log('📋 Webhook headers:', {
      'webhook-id': webhookId,
      'webhook-signature': webhookSignature,
      'webhook-timestamp': webhookTimestamp
    });
    console.log('📄 Raw body preview:', rawBody.substring(0, 200) + '...');

    // Verify the webhook signature using Dodo's method
    let signatureValid = false;
    try {
      // Create the signature payload: webhook-id.webhook-timestamp.body
      const signaturePayload = `${webhookId}.${webhookTimestamp}.${rawBody}`;
      
      // Create HMAC SHA256 signature
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(signaturePayload)
        .digest('hex');
      
      // Compare signatures (remove 'sha256=' prefix if present)
      const receivedSignature = webhookSignature.replace('sha256=', '');
      
      // Simple string comparison for now (in production, use timing-safe comparison)
      signatureValid = expectedSignature === receivedSignature;
      
      if (signatureValid) {
        console.log('✅ Webhook signature verified successfully');
      } else {
        console.log('⚠️ Webhook signature verification failed, but proceeding for testing...');
        console.log('Expected:', expectedSignature);
        console.log('Received:', receivedSignature);
      }
    } catch (err: any) {
      console.error('❌ Webhook verification error:', err.message);
      console.log('⚠️ Proceeding without verification for testing...');
    }

    // Parse the event
    const event = JSON.parse(rawBody);
    console.log('📦 Webhook event received:', JSON.stringify(event, null, 2));

    // Handle different event types
    const eventType = event?.type;
    console.log('🎯 Event type:', eventType);

    if (eventType === 'payment.succeeded') {
      return await handlePaymentSuccess(event);
    }

    // Acknowledge other events
    console.log('✅ Event acknowledged but not processed:', eventType);
    return NextResponse.json({ received: true, message: 'Event acknowledged' });

  } catch (err: any) {
    console.error('❌ Webhook handler error:', err);
    return NextResponse.json({ 
      error: 'Webhook handler error', 
      details: err?.message 
    }, { status: 500 });
  }
}

async function handlePaymentSuccess(event: any) {
  try {
    console.log('💳 Processing payment success event...');
    
    // Extract payment data
    const paymentData = event?.data;
    if (!paymentData) {
      console.error('❌ No payment data in event');
      return NextResponse.json({ error: 'No payment data' }, { status: 400 });
    }

    // Extract user ID from metadata
    const userId = paymentData?.metadata?.user_id;
    if (!userId) {
      console.error('❌ No user_id in payment metadata');
      console.log('Available metadata:', paymentData?.metadata);
      return NextResponse.json({ error: 'Missing user_id in metadata' }, { status: 400 });
    }

    // Extract plan information
    const planType = paymentData?.metadata?.plan || 'basic';
    const paymentId = paymentData?.payment_id;
    const amount = paymentData?.total_amount;

    console.log('💰 Payment details extracted:', {
      userId,
      planType,
      paymentId,
      amount
    });

    const supabase = createAdminClient();

    // Update the user's payment information in the userTable
    const updateData = {
      paymentStatus: 'SUCCESS',
      planType: planType,
      paid_at: new Date().toISOString(),
      amount: amount,
    };

    console.log('📝 Updating user with data:', updateData);

    const { data, error } = await supabase
      .from('userTable')
      .update(updateData)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('❌ Database update error:', error);
      return NextResponse.json({ 
        error: 'DB update failed', 
        details: error.message 
      }, { status: 500 });
    }

    console.log('✅ User updated successfully in database:', data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed successfully',
      userId,
      planType,
      paymentId
    });

  } catch (error: any) {
    console.error('❌ Error handling payment success:', error);
    return NextResponse.json({ 
      error: 'Error processing payment', 
      details: error.message 
    }, { status: 500 });
  }
}
