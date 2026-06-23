import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Dùng Service Role Key để bypass RLS
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        name: body.name,
        phone: body.phone,
        address: body.address,
        product: body.product,
        price: parseInt(body.price),
        quantity: body.quantity,
        note: body.note || '',
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    console.error('Submit Order Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}