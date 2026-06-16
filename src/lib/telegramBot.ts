import TelegramBot from 'node-telegram-bot-api'

const token = process.env.TELEGRAM_BOT_TOKEN!
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

export const bot = new TelegramBot(token, { webHook: true })

export async function setWebhook() {
  await bot.setWebHook(`${baseUrl}/api/telegram`)
}
