import { NextResponse } from 'next/server'
import { setWebhook } from '@/lib/telegramBot'

export async function GET() {
  try {
    await setWebhook()
    return NextResponse.json({ success: true, message: 'Webhook Telegram configuré' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
