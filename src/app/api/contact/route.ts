import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const { email, message } = await request.json()
  if (!message) return NextResponse.json({ error: 'Message requis' }, { status: 400 })

  await prisma.contactMessage.create({
    data: { email, message },
  })
  return NextResponse.json({ success: true })
}
