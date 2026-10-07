/**
 * Automated test script for Telegram Webhook handler authentication and /start logic.
 *
 * Verifies:
 * 1. Correct secret -> 200
 * 2. Wrong secret -> 401
 * 3. Missing secret when a secret is configured -> 401
 * 4. /start update with correct secret -> 200
 */

import { verifyWebhookSecret, buildStartMessage, getMiniAppUrl } from '../src/lib/telegram-bot';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING TELEGRAM WEBHOOK AUTOMATED TESTS');
  console.log('====================================================\n');

  const TEST_SECRET = 'd8b573a3ef903d64f387598f0de294cbc4201aa92d00ed0998a7e667843a8c94';

  // --- TEST 1: Correct secret -> 200 ---
  process.env.TELEGRAM_WEBHOOK_SECRET = TEST_SECRET;
  const isMatch1 = verifyWebhookSecret(TEST_SECRET);
  console.log('Test 1 [Correct secret]:', isMatch1 ? 'PASS (matches -> allows 200)' : 'FAIL');
  if (!isMatch1) throw new Error('Test 1 failed: Expected true for matching secret');

  // Also test quote resilience (e.g. if quotes were saved in Vercel)
  process.env.TELEGRAM_WEBHOOK_SECRET = `"${TEST_SECRET}"`;
  const isMatchQuotes = verifyWebhookSecret(TEST_SECRET);
  console.log('Test 1b [Quoted env secret]:', isMatchQuotes ? 'PASS (matches with quotes stripped)' : 'FAIL');
  if (!isMatchQuotes) throw new Error('Test 1b failed: Expected true for quoted env secret');

  // Restore unquoted secret
  process.env.TELEGRAM_WEBHOOK_SECRET = TEST_SECRET;

  // --- TEST 2: Wrong secret -> 401 ---
  const isMatch2 = verifyWebhookSecret('incorrect_secret_token_xyz');
  console.log('Test 2 [Wrong secret]:', !isMatch2 ? 'PASS (rejected -> returns 401)' : 'FAIL');
  if (isMatch2) throw new Error('Test 2 failed: Expected false for wrong secret');

  // --- TEST 3: Missing secret when configured -> 401 ---
  const isMatch3a = verifyWebhookSecret(null);
  const isMatch3b = verifyWebhookSecret(undefined);
  const isMatch3c = verifyWebhookSecret('');
  const pass3 = !isMatch3a && !isMatch3b && !isMatch3c;
  console.log('Test 3 [Missing secret when configured]:', pass3 ? 'PASS (all rejected -> returns 401)' : 'FAIL');
  if (!pass3) throw new Error('Test 3 failed: Expected false when header is missing');

  // --- TEST 4: /start update with correct secret -> 200 ---
  const startMsg = buildStartMessage('Artur');
  const hasGreeting = startMsg.text.includes('Xush kelibsiz');
  const inlineButton = startMsg.replyMarkup.inline_keyboard[0][0];
  const hasButton = inlineButton.text === '🧠 Testni boshlash';
  const hasWebAppUrl = inlineButton.web_app.url === getMiniAppUrl();

  const pass4 = isMatch1 && hasGreeting && hasButton && hasWebAppUrl;
  console.log('Test 4 [/start payload with correct secret]:', pass4 ? 'PASS (valid message & inline Web App button)' : 'FAIL');
  console.log('   -> Button text:', inlineButton.text);
  console.log('   -> WebApp URL:', inlineButton.web_app.url);
  if (!pass4) throw new Error('Test 4 failed: /start message generation error');

  console.log('\n====================================================');
  console.log('✅ ALL 4 WEBHOOK AUTHENTICATION TESTS PASSED!');
  console.log('====================================================\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
