const dangerColors = {
  FAIBLE: 'bg-green-500/20 text-green-400 border-green-500/30',
  MOYEN: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ELEVE: 'bg-red-500/20 text-red-400 border-red-500/30',
} as const

type DangerLevel = keyof typeof dangerColors

export function DangerBadge({ level }: { level: DangerLevel }) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${dangerColors[level]}`}>
      {level === 'FAIBLE' ? '⚠️ Faible' : level === 'MOYEN' ? '🔶 Moyen' : '🚨 Élevé'}
    </span>
  )
}
