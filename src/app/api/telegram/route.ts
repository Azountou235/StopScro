import { NextRequest, NextResponse } from 'next/server'
import { bot } from '@/lib/telegramBot'

export async function POST(request: NextRequest) {
  const body = await request.json()
  await bot.processUpdate(body)
  return NextResponse.json({ ok: true })
}
