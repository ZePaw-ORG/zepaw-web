import { NextResponse } from 'next/server';

// In-memory rate limiter (per IP)
const rateStore = new Map();
const RATE_LIMIT = 5; // requests
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function rateLimit(ip) {
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

function getIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

async function handleBetaSignup(request) {
  const ip = getIp(request);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const { name, email, phone, petType, city, website } = body || {};

  // Honeypot: bots will fill this hidden field
  if (website && website.trim() !== '') {
    // Fake success to bots
    return NextResponse.json({ success: true });
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json(
      { success: false, error: 'Please enter your full name.' },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: 'Please enter a valid email.' },
      { status: 400 }
    );
  }
  if (!petType || typeof petType !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Please select a pet type.' },
      { status: 400 }
    );
  }
  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    return NextResponse.json({ success: false, error: 'Please enter your city.' }, { status: 400 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not configured');
    return NextResponse.json(
      { success: false, error: 'Server not configured. Please try again later.' },
      { status: 500 }
    );
  }

  const timestamp = new Date().toISOString();
  const content = [
    '🐾 **New ZePaw Beta Signup**',
    '',
    `**Name:**\n${name.trim()}`,
    '',
    `**Email:**\n${email.trim()}`,
    '',
    `**Phone:**\n${phone && phone.trim() ? phone.trim() : 'Not provided'}`,
    '',
    `**Pet Type:**\n${petType}`,
    '',
    `**City:**\n${city.trim()}`,
    '',
    `**Submitted At:**\n${timestamp}`,
  ].join('\n');

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'ZePaw Beta',
        content,
        embeds: [
          {
            title: '🐾 New ZePaw Beta Signup',
            color: 0x14b8a6,
            fields: [
              { name: 'Name', value: name.trim(), inline: true },
              { name: 'Email', value: email.trim(), inline: true },
              { name: 'Phone', value: phone && phone.trim() ? phone.trim() : 'N/A', inline: true },
              { name: 'Pet Type', value: petType, inline: true },
              { name: 'City', value: city.trim(), inline: true },
              { name: 'Submitted At', value: timestamp, inline: false },
            ],
            footer: { text: 'ZePaw — Every Pet Deserves an Identity' },
            timestamp,
          },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Discord webhook failed:', res.status, text);
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

export async function GET(request, { params }) {
  const p = (params?.path || []).join('/');
  if (p === 'health' || p === '') {
    return NextResponse.json({ status: 'ok', service: 'ZePaw API' });
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request, { params }) {
  const p = (params?.path || []).join('/');
  if (p === 'beta' || p === 'beta-signup') {
    return handleBetaSignup(request);
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
