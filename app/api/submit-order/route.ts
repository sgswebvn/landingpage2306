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

    // Đồng bộ lên Google Sheets qua Webhook (nếu có cấu hình)
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (googleSheetWebhookUrl) {
      try {
        await fetch(googleSheetWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.id,
            name: data.name,
            phone: data.phone,
            address: data.address,
            products: data.product,
            totalPrice: data.price,
            note: data.note || ''
          })
        });
      } catch (webhookError) {
        console.error("Gửi Google Sheets thất bại nhưng đơn hàng đã được lưu:", webhookError);
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    console.error('Submit Order Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}