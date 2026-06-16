import { prisma } from '@/lib/prisma'
import { ScammerCard } from '@/components/ScammerCard'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CountryPage({
  params,
}: {
  params: { country: string }
}) {
  const countryName = decodeURIComponent(params.country)
  const country = await prisma.country.findUnique({
    where: { name: countryName },
    include: {
      scammers: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!country) notFound()

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        {country.flag} {country.name}
      </h1>
      <p className="text-gray-400 mb-8">{country.scammers.length} arnaqueur{country.scammers.length > 1 ? 's' : ''} signalé{country.scammers.length > 1 ? 's' : ''}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {country.scammers.map((s) => (
          <ScammerCard key={s.id} scammer={s} />
        ))}
      </div>
    </div>
  )
}
