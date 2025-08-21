// app/actions/verifyPayment.ts
'use server'
import { createClient } from "@/utils/supabase/server";
import { dodopayments } from "@/lib/dodopayments";

// Verify payment for Dodo Payments using session ID or payment parameters
export async function verifyPayment(sessionId: string) {
  if (!sessionId || sessionId === '{CHECKOUT_SESSION_ID}') {
    throw new Error('Invalid session ID parameter');
  }

  try {
    console.log('🔍 Verifying payment for session:', sessionId);
    
    // Get current user to check their payment status in database
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Check if payment was already recorded in our database via webhook
    const { data: userData, error: dbError } = await supabase
      .from("userTable")
      .select("paymentStatus, amount, planType, paid_at")
      .eq('id', user.id)
      .single();

    if (dbError) {
      console.error("Error checking user payment status:", dbError);
      throw dbError;
    }

    // If webhook already processed payment, return success
    if (userData?.paymentStatus === 'SUCCESS' || userData?.paymentStatus === 'paid' || userData?.paymentStatus === 'completed') {
      console.log('✅ Payment already confirmed via webhook');
      return {
        success: true,
        status: 'paid',
        details: {
          id: sessionId,
          amount_total: userData.amount,
          payment_status: userData.paymentStatus,
        }
      };
    }

    // Optional: Give webhook a moment to process if payment was very recent
    console.log('⏳ Payment not yet confirmed via webhook, checking again...');
    
    // Give webhook a moment to process if payment was very recent
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check database again
    const { data: updatedUserData } = await supabase
      .from("userTable")
      .select("paymentStatus, amount, planType")
      .eq('id', user.id)
      .single();

    if (updatedUserData?.paymentStatus === 'SUCCESS' || updatedUserData?.paymentStatus === 'paid' || updatedUserData?.paymentStatus === 'completed') {
      console.log('✅ Payment confirmed after retry');
      return {
        success: true,
        status: 'paid',
        details: {
          id: sessionId,
          amount_total: updatedUserData.amount,
          payment_status: updatedUserData.paymentStatus,
        }
      };
    }

    // If still no payment found, return pending/failed status
    return {
      success: false,
      status: updatedUserData?.paymentStatus || 'pending',
      details: {
        id: sessionId,
        payment_status: updatedUserData?.paymentStatus || 'pending',
      }
    };

  } catch (error) {
    console.error('Error in verifyPayment:', error);
    throw error;
  }
}