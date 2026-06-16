import { NextRequest, NextResponse } from 'next/server'

// Pour l’instant, on prépare l’endpoint du webhook Telegram.
// On le connectera au bot dans une prochaine étape.
export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log('Telegram update:', body)
  // Le bot sera importé et traité ici plus tard.
  return NextResponse.json({ ok: true })
}
