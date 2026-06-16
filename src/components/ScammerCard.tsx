import { GlassContainer } from './GlassContainer'
import { DangerBadge } from './DangerBadge'
import { FiLink, FiMapPin, FiPhone } from 'react-icons/fi'

interface ScammerCardProps {
  scammer: {
    name: string
    phone?: string | null
    country: { name: string; flag: string }
    city?: string | null
    description: string
    dangerLevel: 'FAIBLE' | 'MOYEN' | 'ELEVE'
    photos: string[]
    createdAt: Date
  }
}

export function ScammerCard({ scammer }: ScammerCardProps) {
  return (
    <GlassContainer className="flex flex-col gap-3 hover:border-neon-blue/40 transition-colors">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold">{scammer.name}</h3>
        <DangerBadge level={scammer.dangerLevel} />
      </div>
      <p className="text-gray-400 text-sm line-clamp-3">{scammer.description}</p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        {scammer.phone && (
          <span className="flex items-center gap-1"><FiPhone /> {scammer.phone}</span>
        )}
        <span className="flex items-center gap-1"><FiMapPin /> {scammer.country.flag} {scammer.country.name}{scammer.city ? `, ${scammer.city}` : ''}</span>
      </div>
      <div className="text-xs text-gray-600 mt-auto">
        Ajouté le {new Date(scammer.createdAt).toLocaleDateString('fr-FR')}
      </div>
    </GlassContainer>
  )
}
