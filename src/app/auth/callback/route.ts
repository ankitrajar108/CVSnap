import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// Helper function to determine redirect based on user data
const getRedirectPath = (user: any): string => {
  console.log('🔍 OAuth callback - checking user data:', {
    paymentStatus: user?.paymentStatus,
    workStatus: user?.workStatus,
    userId: user?.id
  });

  // Check if payment is completed
  const paymentSuccessful = user?.paymentStatus && 
    ['SUCCESS', 'paid', 'completed', 'success'].includes(user.paymentStatus.toLowerCase());

  if (!paymentSuccessful) {
    console.log('❌ OAuth callback - Payment not completed, redirecting to forms');
    return '/forms';
  }

  console.log('✅ OAuth callback - Payment completed, checking work status');

  const workStatus = (user?.workStatus || "").toLowerCase();
  switch (workStatus) {
    case "":
    case "null":
    case null:
    case undefined:
      console.log('📝 OAuth callback - No work status, redirecting to upload intro');
      return '/upload/intro';
    case "ongoing":
      console.log('⏳ OAuth callback - Work in progress, redirecting to wait page');
      return '/wait';
    case "completed":
    case "complete":
      console.log('🎉 OAuth callback - Work completed, redirecting to dashboard');
      return '/dashboard';
    default:
      console.log('❓ OAuth callback - Unknown work status, redirecting to forms');
      return '/forms';
  }
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/login?message=Could not authenticate user`);
    }

    // Ensure a basic user profile exists after successful session exchange
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const email = user.email ?? null;
      try {
        await supabase
          .from('userTable')
          .upsert({ id: user.id, email }, { onConflict: 'id' })
          .select();
      } catch (e) {
        // Non-fatal: proceed even if profile upsert fails
        console.warn('userTable upsert failed on callback:', e);
      }

      // After ensuring user profile exists, check payment status for redirect
      try {
        const { data: userData, error: fetchError } = await supabase
          .from('userTable')
          .select('paymentStatus, workStatus')
          .eq('id', user.id)
          .single();

        if (!fetchError && userData) {
          const redirectPath = getRedirectPath(userData);
          return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
        }
      } catch (e) {
        console.warn('Error fetching user data for redirect:', e);
      }
    }
  }

  // Fallback: redirect to forms if anything goes wrong
  return NextResponse.redirect(`${requestUrl.origin}/forms`);
}
