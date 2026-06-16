import { prisma } from '@/lib/prisma'
import { SearchBar } from '@/components/SearchBar'
import { ScammerCard } from '@/components/ScammerCard'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''
  let results: any[] = []
  if (query.length >= 2) {
    results = await prisma.scammer.findMany({
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
      orderBy: { createdAt: 'desc' },
    })
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 Recherche</h1>
      <SearchBar />
      {query.length >= 2 && (
        <div className="mt-8">
          <p className="text-gray-400 mb-4">
            {results.length} résultat{results.length > 1 ? 's' : ''} pour « {query} »
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((s) => (
              <ScammerCard key={s.id} scammer={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
