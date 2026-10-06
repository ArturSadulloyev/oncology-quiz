/**
 * Telegram Bot API client and message builders
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org';

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      type: string;
      first_name?: string;
      username?: string;
    };
    date: number;
    text?: string;
  };
}

/**
 * Verify secret token sent by Telegram via x-telegram-bot-api-secret-token header
 */
export function verifyWebhookSecret(headerSecret: string | null): boolean {
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!configuredSecret) {
    // If no secret configured, allow request (standard mode)
    return true;
  }
  return headerSecret === configuredSecret;
}

/**
 * Returns the resolved Mini App URL from environment variables
 */
export function getMiniAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://oncology-quiz.vercel.app';
}

/**
 * Build the /start welcome message and official inline Web App launch button
 */
export function buildStartMessage(firstName?: string): {
  text: string;
  replyMarkup: {
    inline_keyboard: Array<Array<{ text: string; web_app: { url: string } }>>;
  };
} {
  const greeting = firstName ? `👋 Xush kelibsiz, ${firstName}!` : '👋 Xush kelibsiz!';
  const appUrl = getMiniAppUrl();

  const text = `${greeting}

Onkologiya bo‘yicha test savollarini ishlab, bilimlaringizni mustahkamlang.`;

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: '🧠 Testni boshlash',
          web_app: {
            url: appUrl,
          },
        },
      ],
    ],
  };

  return { text, replyMarkup };
}

/**
 * Build generic fallback message for other chat messages
 */
export function buildDefaultMessage(): {
  text: string;
  replyMarkup: {
    inline_keyboard: Array<Array<{ text: string; web_app: { url: string } }>>;
  };
} {
  const appUrl = getMiniAppUrl();

  const text = `👋 Xush kelibsiz!

Onkologiya bo‘yicha test savollarini ishlab, bilimlaringizni mustahkamlang.`;

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: '🧠 Testni boshlash',
          web_app: {
            url: appUrl,
          },
        },
      ],
    ],
  };

  return { text, replyMarkup };
}

/**
 * Send a message to a Telegram chat via Bot API
 * Note: Never log the bot token in error traces.
 */
export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  replyMarkup?: Record<string, any>
): Promise<{ ok: boolean; description?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error('[TelegramBot] Error: TELEGRAM_BOT_TOKEN is not configured.');
    return { ok: false, description: 'TELEGRAM_BOT_TOKEN missing' };
  }

  const endpoint = `${TELEGRAM_API_BASE}/bot${token}/sendMessage`;

  const payload: Record<string, any> = {
    chat_id: chatId,
    text,
  };

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      console.error(
        `[TelegramBot] Telegram API error: status=${res.status}, desc=${data.description || 'unknown'}`
      );
      return { ok: false, description: data.description };
    }

    return { ok: true };
  } catch (err: any) {
    console.error(`[TelegramBot] Network/Fetch error: ${err.message || 'unknown'}`);
    return { ok: false, description: err.message };
  }
}
