import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user's data from userTable
    const { data: userData, error } = await supabase
      .from('userTable')
      .select('paymentStatus, workStatus, planType, paid_at, amount')
      .eq('id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Determine if payment is successful
    const paymentSuccessful = userData?.paymentStatus && 
      ['SUCCESS', 'paid', 'completed', 'success'].includes(userData.paymentStatus.toLowerCase());

    // Determine next redirect path
    let nextRedirect = '/forms';
    if (paymentSuccessful) {
      const workStatus = (userData.workStatus || "").toLowerCase();
      switch (workStatus) {
        case "":
        case "null":
        case null:
        case undefined:
          nextRedirect = '/upload/intro';
          break;
        case "ongoing":
          nextRedirect = '/wait';
          break;
        case "completed":
        case "complete":
          nextRedirect = '/dashboard';
          break;
        default:
          nextRedirect = '/forms';
          break;
      }
    }

    return NextResponse.json({
      user_id: user.id,
      email: user.email,
      paymentStatus: userData?.paymentStatus || null,
      workStatus: userData?.workStatus || null,
      planType: userData?.planType || null,
      paid_at: userData?.paid_at || null,
      amount: userData?.amount || null,
      paymentSuccessful,
      nextRedirect,
      message: paymentSuccessful 
        ? 'Payment completed - user should be redirected based on work status' 
        : 'Payment not completed - user should go to forms/checkout'
    });

  } catch (err: any) {
    console.error('Error checking payment status:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
