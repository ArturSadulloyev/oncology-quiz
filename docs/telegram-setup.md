# Telegram Mini App Configuration Guide

This guide details the exact steps to configure your **Oncology Quiz** Telegram Mini App using `@BotFather` after deploying the Next.js frontend to an HTTPS domain (e.g. Vercel).

---

## 1. Prerequisites

1. An active Telegram account.
2. The deployed HTTPS URL of your web application (for example: `https://oncology-quiz.vercel.app`).
   > **Note:** Telegram strictly requires `https://`. HTTP or localhost will not load inside mobile Telegram.

---

## 2. Step-by-Step Bot Creation

1. Open Telegram and search for the official **[@BotFather](https://t.me/BotFather)** bot (verified with a blue checkmark).
2. Tap **Start** or send:
   ```text
   /newbot
   ```
3. BotFather will ask for a **display name**:
   ```text
   Oncology Quiz
   ```
4. BotFather will ask for a **username** (must be unique and end with `bot`):
   ```text
   oncology_practice_quiz_bot
   ```
5. BotFather will return your **HTTP API Token**:
   ```text
   Use this token to access the HTTP API:
   7123456789:AAH...example_token...
   ```
   > ⚠️ **Keep this token secret!** Copy it into your `.env.local` as `TELEGRAM_BOT_TOKEN`. Never commit it to GitHub.

---

## 3. Configuring the Chat Menu Button (Primary Entry Point)

The Menu Button appears persistently in the bottom-left corner of the chat next to the message input field.

1. In `@BotFather`, send:
   ```text
   /setmenubutton
   ```
2. Select your bot from the inline keyboard.
3. BotFather asks:
   > *Send me the URL for the Menu button...*
   Enter your production HTTPS URL:
   ```text
   https://your-app-name.vercel.app
   ```
4. BotFather asks for the button title:
   ```text
   Testni boshlash
   ```
   *(Or `Oncology Quiz`)*
5. BotFather confirms: *Menu button updated successfully.*

---

## 4. Configuring the Main Mini App (`/newapp`)

Creating a named Mini App gives you a direct link like `t.me/your_bot_username/quiz` that can be shared in Telegram channels, groups, or medical study chats.

1. In `@BotFather`, send:
   ```text
   /newapp
   ```
2. Select your newly created bot.
3. Enter the title:
   ```text
   Oncology Quiz
   ```
4. Enter a short description (under 120 chars):
   ```text
   Onkologiya fanidan tibbiy imtihonlarga tayyorlanish uchun interaktiv test platformasi.
   ```
5. Upload a photo/banner for the web app (640x360 px, or an oncology/medical icon).
6. When prompted for the **Web App URL**, enter your HTTPS link:
   ```text
   https://your-app-name.vercel.app
   ```
7. Choose a short name for the URL (e.g. `quiz` or `app`):
   ```text
   quiz
   ```
8. BotFather will generate your direct Mini App link:
   ```text
   t.me/oncology_practice_quiz_bot/quiz
   ```

---

## 5. Setting Bot Information and About

To give the bot a professional look:

1. **Description** (shown before the user taps Start):
   ```text
   /setdescription
   ```
   *Text:*
   `Onkologiya boʻyicha tibbiy testlar va spaced-repetition mashqlari. 498 ta practice-ready savol.`

2. **About** (shown on the bot profile):
   ```text
   /setabouttext
   ```
   *Text:*
   `Oncology Quiz — tibbiy imtihonlarga tayyorgarlik uchun Telegram Mini App.`

---

## 6. Testing on iPhone & Android

1. Open your Telegram app on iPhone or Android.
2. In the search bar, type your bot username (e.g. `@oncology_practice_quiz_bot`) and open the chat.
3. Tap the **Menu Button** in the bottom-left corner (`Testni boshlash`), or open the direct link `t.me/oncology_practice_quiz_bot/quiz`.
4. **Verification checklist on mobile**:
   - [ ] The Mini App opens inside Telegram's native in-app viewport.
   - [ ] The app automatically expands to full height (`Telegram.WebApp.expand()`).
   - [ ] Your Telegram first name is displayed in the greeting banner.
   - [ ] Tap **Start Smart Review**:
     - Question and options load cleanly without horizontal scrolling.
     - Telegram native **Back Button** (`←`) appears in the Telegram header.
     - Tapping the native Back Button returns to the Home view.
     - Answering questions triggers smooth native haptic feedback.
   - [ ] Bottom tabs (`Asosiy`, `Mashq`, `Xatolar`, `Tarix`, `Statistika`) are comfortable to tap above the iPhone home indicator.
