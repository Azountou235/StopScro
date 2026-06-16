import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const total = await prisma.scammer.count()
  const countries = await prisma.country.findMany({
    include: { _count: { select: { scammers: true } } },
  })
  const byDanger = await prisma.scammer.groupBy({
    by: ['dangerLevel'],
    _count: true,
  })
  return NextResponse.json({ total, countries, byDanger })
}
