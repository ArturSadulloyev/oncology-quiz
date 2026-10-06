import { NextRequest, NextResponse } from 'next/server';
import {
  TelegramUpdate,
  verifyWebhookSecret,
  buildStartMessage,
  buildDefaultMessage,
  sendTelegramMessage,
} from '@/lib/telegram-bot';

export const dynamic = 'force-dynamic';

/**
 * GET healthcheck for checking endpoint availability
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Oncology Quiz Telegram Webhook',
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST handler for Telegram Webhook updates
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Telegram secret token header if configured
    const secretHeader = req.headers.get('x-telegram-bot-api-secret-token');
    if (!verifyWebhookSecret(secretHeader)) {
      console.warn('[TelegramWebhook] Rejected unauthorized request: invalid secret token header.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse update body
    const body: TelegramUpdate = await req.json();

    if (!body || !body.message) {
      // Non-message updates (e.g. edits, inline queries) - acknowledge with 200 OK
      return NextResponse.json({ ok: true });
    }

    const message = body.message;
    const chatId = message.chat?.id;
    const text = message.text?.trim() || '';
    const firstName = message.from?.first_name;

    if (!chatId) {
      return NextResponse.json({ ok: true });
    }

    // 3. Process commands
    if (text.startsWith('/start')) {
      const { text: replyText, replyMarkup } = buildStartMessage(firstName);
      await sendTelegramMessage(chatId, replyText, replyMarkup);
    } else {
      // Graceful fallback for any other text messages
      const { text: replyText, replyMarkup } = buildDefaultMessage();
      await sendTelegramMessage(chatId, replyText, replyMarkup);
    }

    // 4. Return HTTP 200 OK to Telegram immediately
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Log internal error safely without exposing secrets, and return 200 OK to prevent Telegram retry spam
    console.error('[TelegramWebhook] Unexpected error handling update:', err.message || err);
    return NextResponse.json({ ok: true, handledError: true });
  }
}
