import { prisma } from '@/lib/prisma'
import { GlassContainer } from '@/components/GlassContainer'
import { DangerBadge } from '@/components/DangerBadge'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const total = await prisma.scammer.count()
  const pending = await prisma.pendingReport.count({ where: { status: 'PENDING' } })
  const scammers = await prisma.scammer.findMany({
    include: { country: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  const byCountry = await prisma.country.findMany({
    include: { _count: { select: { scammers: true } } },
  })

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📊 Tableau de bord</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <GlassContainer className="text-center">
          <div className="text-2xl font-extrabold text-neon-blue">{total}</div>
          <div className="text-xs text-gray-400">Signalements</div>
        </GlassContainer>
        <GlassContainer className="text-center">
          <div className="text-2xl font-extrabold text-yellow-400">{pending}</div>
          <div className="text-xs text-gray-400">En attente</div>
        </GlassContainer>
        <GlassContainer className="text-center">
          <div className="text-2xl font-extrabold text-neon-blue">{byCountry.length}</div>
          <div className="text-xs text-gray-400">Pays</div>
        </GlassContainer>
      </div>

      <h2 className="text-xl font-bold mb-4">🌍 Par pays</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {byCountry.map((c) => (
          <Link key={c.id} href={`/country/${encodeURIComponent(c.name)}`}>
            <GlassContainer className="hover:border-neon-blue/40 transition-colors text-center cursor-pointer">
              <div className="text-2xl">{c.flag}</div>
              <div className="text-sm mt-1">{c.name}</div>
              <div className="text-neon-blue font-bold">{c._count.scammers}</div>
            </GlassContainer>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">📋 Derniers signalements</h2>
      <div className="space-y-3">
        {scammers.map((s) => (
          <GlassContainer key={s.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="font-semibold">{s.name}</span>
              <span className="text-sm text-gray-400 ml-2">{s.phone}</span>
              <div className="text-xs text-gray-500">{s.country.flag} {s.country.name}</div>
            </div>
            <DangerBadge level={s.dangerLevel} />
          </GlassContainer>
        ))}
      </div>
    </div>
  )
}
