'use client'
import { GlassContainer } from './GlassContainer'
import { FiUser, FiPhone, FiExternalLink } from 'react-icons/fi'
import { FaTelegram, FaTiktok, FaWhatsapp, FaFacebook } from 'react-icons/fa'
import { motion } from 'framer-motion'

export function FounderCard() {
  const founder = {
    name: 'Mahamat Oumar',
    title: 'Sociologue — Passionné de cybersécurité — Fondateur',
    description: `Je suis Mahamat Oumar, sociologue et passionné de cybersécurité.

Grâce à cette passion, je m'investis activement dans la lutte contre les arnaques en ligne et la sensibilisation des internautes aux risques du numérique.

À travers cette plateforme, mon objectif est de contribuer à la protection des utilisateurs en partageant des informations utiles, en documentant les méthodes utilisées par les fraudeurs et en encourageant la vigilance sur Internet.

Je suis convaincu que la prévention, l'éducation numérique et le partage d'informations sont des outils essentiels pour réduire les risques d'arnaque et renforcer la sécurité de nos communautés.`,
    photo: '/founder.jpg', // à remplacer plus tard
    contacts: [
      { icon: FaTelegram, url: 'https://t.me/Seigneur_235', label: 'Telegram' },
      { icon: FaTiktok, url: 'https://www.tiktok.com/@Dogordami_1', label: 'TikTok' },
      { icon: FaWhatsapp, url: 'https://wa.me/23591234568', label: 'WhatsApp' },
      { icon: FaFacebook, url: 'https://www.facebook.com/mahamat.oumar.moussa.2025', label: 'Facebook' },
      { icon: FaWhatsapp, url: 'https://whatsapp.com/channel/0029VbBZrLBFMqrQIDpcfO04', label: 'Chaîne WhatsApp' },
      { icon: FiExternalLink, url: 'https://mahamat-oumar-moussa-houma.vercel.app', label: 'Site personnel' },
    ],
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <GlassContainer className="flex flex-col md:flex-row gap-8 items-center md:items-start p-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-neon-blue flex-shrink-0 bg-gray-800">
          {/* Remplacer par <Image> si fichier présent, sinon icône */}
          <div className="w-full h-full flex items-center justify-center text-neon-blue">
            <FiUser size={60} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{founder.name}</h2>
          <p className="text-sm text-neon-blue">{founder.title}</p>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">{founder.description}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            {founder.contacts.map((c, idx) => (
              <a
                key={idx}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-3 rounded-full hover:text-neon-blue hover:border-neon-blue transition-colors"
                title={c.label}
              >
                <c.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </GlassContainer>
    </motion.div>
  )
}
