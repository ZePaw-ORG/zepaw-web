import { supabaseAdmin } from '@/utils/supabase/admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiter (per IP)
const rateStore = new Map();
const RATE_LIMIT = 5; // requests
const RATE_WINDOW_MS = 60 * 1000; // 1 minute
const tableName = process.env.TABLE_NAME ?? '';

function rateLimit(ip: string) {
  const now = Date.now();
  const record = rateStore.get(ip) || { count: 0, start: now };
  if (now - record.start > RATE_WINDOW_MS) {
    record.count = 0;
    record.start = now;
  }
  record.count += 1;
  rateStore.set(ip, record);
  return record.count <= RATE_LIMIT;
}

function getIp(request: NextRequest) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

async function handleBetaSignup(request: NextRequest) {
  const ip = getIp(request);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }
  let body;
  try {
    const cookieStore = await cookies();
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const { full_name, email_address, phone_number, pet_type, city, state } = body || {};

  if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
    return NextResponse.json(
      { success: false, error: 'Please enter your full name.' },
      { status: 400 }
    );
  }
  if (!isValidEmail(email_address)) {
    return NextResponse.json(
      { success: false, error: 'Please enter a valid email.' },
      { status: 400 }
    );
  }
  if (!pet_type || typeof pet_type !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Please select a pet type.' },
      { status: 400 }
    );
  }
  if (!state || typeof state !== 'string' || state.trim().length < 2) {
    return NextResponse.json(
      { success: false, error: 'Please select your state.' },
      { status: 400 }
    );
  }
  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    return NextResponse.json(
      { success: false, error: 'Please select your city.' },
      { status: 400 }
    );
  }

  // Avoid duplicate entries with check on email
  const { data: emailFound } = await supabaseAdmin
    .from(tableName)
    .select()
    .eq('email_address', email_address);

  if (emailFound?.length) {
    return NextResponse.json(
      {
        success: false,
        error: 'This email is already on our beta waitlist.',
      },
      { status: 409 }
    );
  }

  try {
    const insertPayload: Record<string, any> = {
      full_name: full_name.trim(),
      email_address: email_address.trim(),
      phone_number: phone_number.trim() ?? null,
      pet_type: pet_type.trim(),
      city: city.trim(),
      state: state.trim(),
    };

    let { error } = await supabaseAdmin.from(tableName).insert(insertPayload).select();

    // Fallback if table does not yet have 'state' column
    // if (error && error.message && error.message.toLowerCase().includes('state')) {
    //   const fallbackPayload = { ...insertPayload };
    //   delete fallbackPayload.state;
    //   const fallbackResult = await supabaseAdmin.from(tableName).insert(fallbackPayload).select();
    //   error = fallbackResult.error;
    // }
    // const { error } = await supabaseAdmin
    //   .from(tableName)
    //   .insert({
    //     full_name: full_name.trim(),
    //     email_address: email_address.trim(),
    //     phone_number: phone_number.trim() ?? null,
    //     pet_type: pet_type.trim(),
    //     city: city.trim(),
    //     state: state.trim(),
    //   })
    //   .select();

    if (error) {
      console.error('Something went wrong- ', error);
      return NextResponse.json(
        { success: false, error: 'Could not submit right now. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { success: false, error: 'Network error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return handleBetaSignup(request);
  } catch (err) {
    return NextResponse.json({ error: `Something went wrong: ${err}` }, { status: 500 });
  }
}
