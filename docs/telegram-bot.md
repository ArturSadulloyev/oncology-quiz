# Telegram Bot Webhook & /start Handler Setup

This guide explains how the **Oncology Quiz** Telegram bot is architected and how to register and verify the production webhook on Vercel.

---

## 1. Required Environment Variables

Add these environment variables to your deployment environment:

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `TELEGRAM_BOT_TOKEN` | **Yes** | Secret bot token issued by `@BotFather` | `8982922988:AAEh...` |
| `TELEGRAM_WEBHOOK_SECRET` | *Optional* | A secret string to verify incoming requests originate from Telegram | `any_secure_random_string` |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Deployed HTTPS URL of the Mini App | `https://oncology-quiz.vercel.app` |

> 🔒 **Security Notice:** Never commit `TELEGRAM_BOT_TOKEN` or `TELEGRAM_WEBHOOK_SECRET` to source code or git repositories.

---

## 2. How to Configure Environment Variables in Vercel

1. Open your project on the [Vercel Dashboard](https://vercel.com).
2. Go to **Settings** $\rightarrow$ **Environment Variables**.
3. Add the following variables:
   - **Key:** `TELEGRAM_BOT_TOKEN`
     - **Value:** `(Your BotFather token)`
     - **Environment:** Select *Production*, *Preview*, and *Development*.
   - **Key:** `NEXT_PUBLIC_APP_URL`
     - **Value:** `https://oncology-quiz.vercel.app`
   - *(Optional)* **Key:** `TELEGRAM_WEBHOOK_SECRET`
     - **Value:** `(Your secret token, e.g. oncology_webhook_secret_2026)`
4. Click **Save** and trigger a **Redeploy** (Deployments $\rightarrow$ Redeploy) so the serverless function picks up the new environment variables.

---

## 3. Production Webhook URL

The production webhook endpoint is hosted on Vercel at:

```text
https://oncology-quiz.vercel.app/api/telegram/webhook
```

---

## 4. How to Register the Webhook

Run the following `curl` command in your terminal (replace `<YOUR_BOT_TOKEN>` with your actual token):

### Standard Registration:
```bash
curl -F "url=https://oncology-quiz.vercel.app/api/telegram/webhook" \
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

### With Webhook Secret Token (Recommended):
If you set `TELEGRAM_WEBHOOK_SECRET="my_secret_token"` in Vercel:
```bash
curl -F "url=https://oncology-quiz.vercel.app/api/telegram/webhook" \
     -F "secret_token=my_secret_token" \
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

### Expected Success Response:
```json
{"ok": true, "result": true, "description": "Webhook was set"}
```

---

## 5. How to Check Webhook Status (`getWebhookInfo`)

To inspect whether Telegram is actively delivering updates to your Vercel endpoint:

```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

### Expected Output:
```json
{
  "ok": true,
  "result": {
    "url": "https://oncology-quiz.vercel.app/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "max_connections": 40,
    "ip_address": "..."
  }
}
```

---

## 6. How to Verify Bot Identity (`getMe`)

Verify that Telegram Bot API recognizes your token and displays your bot's username:

```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe
```

### Expected Output:
```json
{
  "ok": true,
  "result": {
    "id": 8982922988,
    "is_bot": true,
    "first_name": "Oncology Quiz",
    "username": "...",
    "can_join_groups": true,
    "can_read_all_group_messages": false,
    "supports_inline_queries": false
  }
}
```

---

## 7. How `/start` Behaves

When a user opens the bot and sends `/start`:

1. The bot responds with an Uzbek greeting:
   ```text
   👋 Xush kelibsiz, [Foydalanuvchi ismi]!

   Onkologiya boʻyicha test savollarini ishlab, bilimlaringizni mustahkamlang.

   📚 Savollar bazasi: 498 ta tibbiy imtihon savoli
   🧠 Spaced Repetition: Zaif mavzularni avtomatik takrorlash
   📊 Tahlil: Shaxsiy aniqlik darajasi va xatolar bilan ishlash

   Testni boshlash uchun quyidagi tugmani bosing:
   ```
2. Attached to the message is an official Telegram **Inline Web App Button**:
   - **Button text:** `🧠 Testni boshlash`
   - **Action:** Directly opens `https://oncology-quiz.vercel.app` inside the Telegram mobile WebApp container.

---

## 8. How to Test on iPhone

1. Open Telegram on your iPhone.
2. Search for your bot username and open the chat.
3. Tap **Start** (or send `/start`).
4. The bot will instantly reply with the welcome text and the inline button `🧠 Testni boshlash`.
5. Tap **🧠 Testni boshlash**:
   - The Oncology Quiz Mini App slides up in full-height mode.
   - Questions, options, and bottom navigation function seamlessly.
