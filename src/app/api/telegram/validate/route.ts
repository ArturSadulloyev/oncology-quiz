import { NextRequest, NextResponse } from 'next/server';
import { validateTelegramInitData } from '@/lib/telegram-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { initData } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      // In development mode without a token set, return graceful diagnostic response
      return NextResponse.json({
        isValid: false,
        error: 'TELEGRAM_BOT_TOKEN is not configured on the server.',
        devNotice: 'Set TELEGRAM_BOT_TOKEN in .env.local to enable server validation.',
      });
    }

    const result = validateTelegramInitData(initData, botToken);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { isValid: false, error: error?.message || 'Server error during validation' },
      { status: 500 }
    );
  }
}
