'use client'
import { motion } from 'framer-motion'
import { GlassContainer } from './GlassContainer'

interface StatsCounterProps {
  totalScammers: number
  countries: { name: string; flag: string }[]
}

export function StatsCounter({ totalScammers, countries }: StatsCounterProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
      <GlassContainer className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-neon-blue"
        >
          {totalScammers}
        </motion.div>
        <div className="text-sm text-gray-400 mt-1">🚨 Arnaqueurs</div>
      </GlassContainer>
      <GlassContainer className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold text-neon-blue"
        >
          {countries.length}
        </motion.div>
        <div className="text-sm text-gray-400 mt-1">🌍 Pays</div>
      </GlassContainer>
      {/* Ajoute plus de statiques si tu veux */}
    </div>
  )
}
