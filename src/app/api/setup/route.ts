import { NextResponse } from 'next/server'

// Important : enregistre les handlers du bot avant d'activer le webhook
import '@/lib/registerTelegramHandlers'

export async function GET() {
  try {
    const { setWebhook } = await import('@/lib/telegramBot')
    await setWebhook()
    return NextResponse.json({ success: true, message: 'Webhook Telegram configuré' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
