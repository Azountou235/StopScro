'use client'
import Link from 'next/link'
import { FiShield, FiSearch, FiUser } from 'react-icons/fi'

export function Navbar() {
  return (
    <nav className="glass sticky top-4 mx-4 mt-4 z-50 flex items-center justify-between px-6 py-3 rounded-2xl">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold neon-text">
        <FiShield size={28} />
        StopScro
      </Link>
      <div className="flex gap-6 text-sm font-medium">
        <Link href="/search" className="flex items-center gap-1 hover:text-neon-blue transition">
          <FiSearch /> Recherche
        </Link>
        <Link href="/about" className="flex items-center gap-1 hover:text-neon-blue transition">
          <FiUser /> À propos
        </Link>
      </div>
    </nav>
  )
}
