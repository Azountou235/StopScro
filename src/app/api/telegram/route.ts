import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Chargement dynamique du bot et des handlers
  const [{ bot }, _] = await Promise.all([
    import('@/lib/telegramBot'),
    import('@/lib/registerTelegramHandlers')
  ])

  const body = await request.json()
  await bot.processUpdate(body)
  return NextResponse.json({ ok: true })
}
