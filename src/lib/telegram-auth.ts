import crypto from 'crypto';
import { TelegramUser } from './telegram';

export interface TelegramValidationResult {
  isValid: boolean;
  user?: TelegramUser;
  authDate?: number;
  error?: string;
}

/**
 * Validate Telegram WebApp initData on the server using HMAC-SHA256.
 * Adheres strictly to Telegram official security guidelines:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 86400 // 24 hours
): TelegramValidationResult {
  if (!initData) {
    return { isValid: false, error: 'Empty initData provided' };
  }

  if (!botToken) {
    return { isValid: false, error: 'TELEGRAM_BOT_TOKEN not configured on server' };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) {
      return { isValid: false, error: 'Missing hash parameter' };
    }

    // Build data_check_string: alphabetical sort of all params except hash
    const pairs: string[] = [];
    params.forEach((value, key) => {
      if (key !== 'hash') {
        pairs.push(`${key}=${value}`);
      }
    });
    pairs.sort();
    const dataCheckString = pairs.join('\n');

    // Secret key = HMAC-SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculated hash = HMAC-SHA256(dataCheckString, secretKey)
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return { isValid: false, error: 'Invalid HMAC signature' };
    }

    // Verify auth_date freshness
    const authDateStr = params.get('auth_date');
    const authDate = authDateStr ? parseInt(authDateStr, 10) : 0;
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (authDate > 0 && maxAgeSeconds > 0) {
      if (nowInSeconds - authDate > maxAgeSeconds) {
        return { isValid: false, error: 'initData has expired' };
      }
    }

    // Parse user object safely
    const userRaw = params.get('user');
    let user: TelegramUser | undefined;
    if (userRaw) {
      user = JSON.parse(userRaw) as TelegramUser;
    }

    return {
      isValid: true,
      user,
      authDate,
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: `Validation exception: ${err.message}`,
    };
  }
}
