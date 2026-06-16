import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || ''
  if (query.length < 2) return NextResponse.json([])

  const scammers = await prisma.scammer.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { facebookLink: { contains: query, mode: 'insensitive' } },
        { telegramLink: { contains: query, mode: 'insensitive' } },
        { whatsappLink: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { country: { name: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: { country: true },
    take: 20,
  })
  return NextResponse.json(scammers)
}
