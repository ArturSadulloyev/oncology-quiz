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
  const hasSecret = Boolean(process.env.TELEGRAM_WEBHOOK_SECRET);
  return NextResponse.json({
    status: 'ok',
    service: 'Oncology Quiz Telegram Webhook',
    authConfigured: hasSecret,
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST handler for Telegram Webhook updates
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Read secret token header (case-insensitive via standard Web API)
    const receivedSecret =
      req.headers.get('x-telegram-bot-api-secret-token') ||
      req.headers.get('X-Telegram-Bot-Api-Secret-Token');

    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    // Safe boolean diagnostics (NEVER logs secret values)
    const hasExpected = Boolean(expectedSecret);
    const hasReceived = Boolean(receivedSecret);
    const isMatch = verifyWebhookSecret(receivedSecret);

    console.log('[TelegramWebhook] Auth diagnostics:', {
      hasExpectedSecret: hasExpected,
      hasReceivedSecretHeader: hasReceived,
      isSecretMatch: isMatch,
    });

    if (hasExpected && !isMatch) {
      console.warn('[TelegramWebhook] Unauthorized: secret token header mismatch', {
        hasExpectedSecret: hasExpected,
        hasReceivedSecretHeader: hasReceived,
        isSecretMatch: false,
      });

      return NextResponse.json(
        {
          error: 'Unauthorized',
          diagnostics: {
            hasExpectedSecret: hasExpected,
            hasReceivedSecretHeader: hasReceived,
          },
        },
        { status: 401 }
      );
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
