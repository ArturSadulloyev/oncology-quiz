/**
 * Telegram Mini App SDK integration, types, and browser fallback helpers
 */

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
}

export interface TelegramBackButton {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

export interface TelegramHapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged: () => void;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: TelegramBackButton;
  HapticFeedback: TelegramHapticFeedback;
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation?: () => void;
  disableClosingConfirmation?: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

/**
 * Clearly identifiable development fallback user when running outside Telegram
 */
export const DEV_FALLBACK_USER: TelegramUser = {
  id: 99999999,
  first_name: 'Shifokor (Brauzer)',
  last_name: 'Dev',
  username: 'oncology_dev',
  language_code: 'uz',
};

/**
 * Returns true if running inside Telegram Mini App environment
 */
export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') return false;
  const tg = window.Telegram?.WebApp;
  return Boolean(tg && (tg.initData || tg.platform !== 'unknown' && tg.platform !== ''));
}

/**
 * Returns Telegram WebApp instance or null if unavailable
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp || null;
}

/**
 * Returns raw Telegram initData string for secure server-side validation.
 * NEVER trust client-side initDataUnsafe for authorization.
 */
export function getTelegramInitData(): string {
  if (typeof window === 'undefined') return '';
  return window.Telegram?.WebApp?.initData || '';
}

/**
 * Returns the fallback user for local development
 */
export function getTelegramUserForDevelopment(): TelegramUser {
  return DEV_FALLBACK_USER;
}

export interface TelegramContext {
  isAvailable: boolean;
  initData: string;
  user: TelegramUser;
  themeParams?: TelegramThemeParams;
}

export function getTelegramContext(): TelegramContext {
  const isAvailable = isTelegramWebApp();
  const tg = getTelegramWebApp();
  const user = tg?.initDataUnsafe?.user || DEV_FALLBACK_USER;
  return {
    isAvailable,
    initData: tg?.initData || '',
    user,
    themeParams: tg?.themeParams,
  };
}

/**
 * Initialize Telegram WebApp: calls ready(), expand(), and sets colors
 */
export function initTelegramApp(): void {
  if (typeof window === 'undefined') return;
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();

      // Configure iOS-like header and background colors matching app design
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#F2F2F7');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#F2F2F7');
      }
    } catch (e) {
      console.warn('Error during Telegram WebApp initialization:', e);
    }
  }
}

/**
 * Setup Telegram native Back Button with clean teardown
 */
export function setupTelegramBackButton(onBack: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const tg = getTelegramWebApp();
  if (!tg || !tg.BackButton) return () => {};

  try {
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);
  } catch (e) {
    console.warn('Error setting up Telegram BackButton:', e);
  }

  return () => {
    try {
      tg.BackButton.offClick(onBack);
      tg.BackButton.hide();
    } catch {
      // Ignore teardown errors
    }
  };
}

/**
 * Trigger Telegram Haptic Feedback with silent fallback in normal browsers
 */
export function triggerHaptic(type: 'light' | 'success' | 'error' | 'selection'): void {
  if (typeof window === 'undefined') return;
  const haptic = window.Telegram?.WebApp?.HapticFeedback;
  if (!haptic) return;

  try {
    switch (type) {
      case 'light':
        haptic.impactOccurred('light');
        break;
      case 'selection':
        haptic.selectionChanged();
        break;
      case 'success':
        haptic.notificationOccurred('success');
        break;
      case 'error':
        haptic.notificationOccurred('error');
        break;
    }
  } catch {
    // Graceful no-op outside Telegram
  }
}
