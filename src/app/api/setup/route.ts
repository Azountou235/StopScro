import { NextResponse } from 'next/server'

export async function GET() {
  // On importe le bot UNIQUEMENT au moment de la requête (pas au build)
  const { setWebhook } = await import('@/lib/telegramBot')
  // On enregistre les handlers
  await import('@/lib/registerTelegramHandlers')
  
  try {
    await setWebhook()
    return NextResponse.json({ success: true, message: 'Webhook Telegram configuré' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
