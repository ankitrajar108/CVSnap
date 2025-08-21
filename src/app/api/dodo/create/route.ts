import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { dodopayments } from "@/lib/dodopayments";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      metadata = {},
      billing = {},
    } = body || {};

    // Ensure we have the current user id to attach to metadata
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const siteOrigin = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    // Validate required billing fields
    if (!billing.country) {
      return NextResponse.json({ error: 'Country is required' }, { status: 400 });
    }

    console.log("Creating payment for product:", productId);
    
    try {
      // Following the exact boilerplate implementation
      const productWithQuantity = { product_id: productId as string, quantity: 1 };

      const response = await dodopayments.payments.create({
        // Using billing information from the request
        billing: {
          city: billing.city || "", 
          country: billing.country, // Required field from user selection
          state: billing.state || "",
          street: billing.street || "",
          zipcode: billing.zipcode || "",
        },
        customer: {
          email: billing.email || user?.email || "",
          name: billing.name || user?.user_metadata?.full_name || user?.email || "",
        },
        payment_link: true,
        product_cart: [productWithQuantity],
        return_url: `https://cvsnap.app/postcheckout?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          user_id: userId,
          ...metadata,
        },
      });
      
      console.log('Payment created successfully:', response);
      
      // Extract checkout URL - the boilerplate uses payment_link
      const checkoutUrl = (response as any).payment_link_url || response.payment_link || (response as any).url;
      
      if (!checkoutUrl) {
        return NextResponse.json({ 
          error: 'Missing checkout URL in Dodo response', 
          details: response 
        }, { status: 500 });
      }
      
      return NextResponse.json({ url: checkoutUrl });
      
    } catch (e: any) {
      // Surface error details for debugging
      console.error('Dodo payment creation error:', {
        error: e,
        message: e?.message,
        status: e?.status,
        response: e?.response
      });
      
      return NextResponse.json({ 
        error: 'Dodo payment creation failed', 
        details: e?.message || String(e)
      }, { status: e?.status || 500 });
    }
  } catch (err: any) {
    console.error('Create payment error', err);
    return NextResponse.json({ error: 'Create payment error', details: err?.message }, { status: 500 });
  }
}
