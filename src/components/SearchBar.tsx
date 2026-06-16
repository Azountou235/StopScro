'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface ScammerSuggestion {
  id: number
  name: string
  phone?: string | null
  country: { name: string; flag: string }
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ScammerSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    const delay = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
      setLoading(false)
    }, 300)
    return () => clearTimeout(delay)
  }, [query])

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="glass flex items-center gap-3 px-5 py-3 rounded-xl">
        <FiSearch className="text-neon-blue" size={20} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher un numéro, pseudo, lien..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
        />
        {loading && <span className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />}
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full glass rounded-xl overflow-hidden z-50"
          >
            {results.map((s) => (
              <button
                key={s.id}
                onClick={() => router.push(`/search?q=${encodeURIComponent(s.phone || s.name)}`)}
                className="w-full text-left px-5 py-3 hover:bg-white/5 transition flex justify-between items-center"
              >
                <span>{s.name} {s.phone ? `— ${s.phone}` : ''}</span>
                <span className="text-sm text-gray-400">{s.country.flag} {s.country.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
