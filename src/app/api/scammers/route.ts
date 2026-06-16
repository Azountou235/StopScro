import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const scammers = await prisma.scammer.findMany({
    include: { country: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(scammers)
}
