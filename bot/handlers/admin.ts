import { bot } from '../../src/lib/telegramBot'
import { prisma } from '../../src/lib/prisma'
import { adminMainKeyboard, dangerLevelKeyboard } from '../keyboards'
import TelegramBot from 'node-telegram-bot-api'

const adminIds = process.env.ADMIN_TELEGRAM_IDS?.split(',').map(Number) || []
const adminSessions = new Map<number, any>()

bot.onText(/\/admin/, (msg) => {
  const chatId = msg.chat.id
  if (!adminIds.includes(msg.from?.id!)) return
  bot.sendMessage(chatId, '🔐 *Panneau d\'administration*', {
    parse_mode: 'Markdown',
    reply_markup: adminMainKeyboard,
  })
})

bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id
  if (!chatId || !adminIds.includes(query.from.id)) return

  const data = query.data
  if (!data) return

  if (data === 'dashboard') {
    const total = await prisma.scammer.count()
    const pending = await prisma.pendingReport.count({ where: { status: 'PENDING' } })
    const countries = await prisma.country.count()
    bot.sendMessage(chatId, `📊 *Tableau de bord*\n\n📌 Total signalements : ${total}\n⏳ En attente : ${pending}\n🌍 Pays : ${countries}`, { parse_mode: 'Markdown' })
  }
  else if (data === 'add_scammer') {
    adminSessions.set(chatId, { step: 'name' })
    bot.sendMessage(chatId, '✏️ Entrez le *nom ou pseudo* de l\'arnaqueur :', { parse_mode: 'Markdown' })
  }
  else if (data === 'list_pending') {
    const pending = await prisma.pendingReport.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' } })
    if (pending.length === 0) {
      bot.sendMessage(chatId, '✅ Aucun signalement en attente.')
      return
    }
    const list = pending.map(p => `#${p.id} - ${p.name} (${p.countryName})`).join('\n')
    bot.sendMessage(chatId, `📋 *Signalements en attente :*\n${list}`, { parse_mode: 'Markdown' })
  }
  else if (data === 'stats') {
    const total = await prisma.scammer.count()
    const byDanger = await prisma.scammer.groupBy({ by: ['dangerLevel'], _count: true })
    const topCountries = await prisma.country.findMany({ include: { _count: { select: { scammers: true } } }, orderBy: { scammers: { _count: 'desc' } }, take: 10 })
    let statsText = `📈 *Statistiques*\n🔢 Total : ${total}\n\n*Niveaux de danger :*\n`
    byDanger.forEach(d => { statsText += `- ${d.dangerLevel} : ${d._count}\n` })
    statsText += '\n*Top pays :*\n'
    topCountries.forEach(c => { statsText += `- ${c.flag} ${c.name} : ${c._count.scammers}\n` })
    bot.sendMessage(chatId, statsText, { parse_mode: 'Markdown' })
  }
  else if (data === 'list_countries') {
    const countries = await prisma.country.findMany({ include: { _count: { select: { scammers: true } } } })
    const text = countries.map(c => `${c.flag} ${c.name} (${c._count.scammers})`).join('\n') || 'Aucun pays'
    bot.sendMessage(chatId, `🌍 *Pays :*\n${text}`, { parse_mode: 'Markdown' })
  }
  else if (data === 'edit_scammer' || data === 'delete_scammer') {
    bot.sendMessage(chatId, 'Entrez l\'ID du signalement à modifier/supprimer. Pour obtenir l\'ID, consultez la liste des signalements.')
    if (data === 'edit_scammer') {
      adminSessions.set(chatId, { step: 'waiting_edit_id' })
    } else {
      adminSessions.set(chatId, { step: 'waiting_delete_id' })
    }
  }
  else if (data.startsWith('danger_')) {
    const level = data.replace('danger_', '') as 'FAIBLE' | 'MOYEN' | 'ELEVE'
    const session = adminSessions.get(chatId)
    if (session && session.step === 'danger') {
      session.dangerLevel = level
      session.step = 'socialLinks'
      adminSessions.set(chatId, session)
      bot.sendMessage(chatId, '🔗 Entrez les *liens des réseaux sociaux* (Facebook, Telegram, WhatsApp...) séparés par des virgules :', { parse_mode: 'Markdown' })
    }
  }
})

// Conversation d'ajout admin
bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text
  if (!text || text.startsWith('/')) return
  if (!adminIds.includes(msg.from?.id!)) return

  const session = adminSessions.get(chatId)
  if (!session) return

  if (session.step === 'name') {
    session.name = text
    session.step = 'phone'
    adminSessions.set(chatId, session)
    bot.sendMessage(chatId, '📞 Entrez le *numéro de téléphone* (ou "non") :', { parse_mode: 'Markdown' })
  }
  else if (session.step === 'phone') {
    session.phone = text === 'non' ? null : text
    session.step = 'country'
    adminSessions.set(chatId, session)
    bot.sendMessage(chatId, '🌍 Entrez le *pays* :', { parse_mode: 'Markdown' })
  }
  else if (session.step === 'country') {
    session.countryName = text
    session.step = 'description'
    adminSessions.set(chatId, session)
    bot.sendMessage(chatId, '📝 Entrez la *description* :', { parse_mode: 'Markdown' })
  }
  else if (session.step === 'description') {
    session.description = text
    session.step = 'danger'
    adminSessions.set(chatId, session)
    bot.sendMessage(chatId, '⚠️ Choisissez le *niveau de danger* :', { reply_markup: dangerLevelKeyboard })
  }
  else if (session.step === 'socialLinks') {
    session.socialLinks = text.split(',').map((s: string) => s.trim()).filter(Boolean)
    session.step = 'photo'
    adminSessions.set(chatId, session)
    bot.sendMessage(chatId, '📸 Envoyez une *photo ou capture* (ou "non") :', { parse_mode: 'Markdown' })
  }
  else if (session.step === 'photo') {
    if (text === 'non') {
      session.photo = null
      session.step = 'confirm'
      adminSessions.set(chatId, session)
      await sendConfirmation(chatId, session)
    } else {
      bot.sendMessage(chatId, 'Veuillez envoyer une photo ou écrire "non".')
    }
  }
  else if (session.step === 'waiting_edit_id' || session.step === 'waiting_delete_id') {
    const id = parseInt(text)
    if (isNaN(id)) {
      bot.sendMessage(chatId, 'ID invalide.')
      adminSessions.delete(chatId)
      return
    }
    if (session.step === 'waiting_delete_id') {
      try {
        await prisma.scammer.delete({ where: { id } })
        bot.sendMessage(chatId, `✅ Signalement #${id} supprimé.`)
      } catch (e) {
        bot.sendMessage(chatId, '❌ Erreur : signalement introuvable.')
      }
      adminSessions.delete(chatId)
    } else {
      bot.sendMessage(chatId, 'Fonction de modification avancée en développement. Utilisez le dashboard web.')
      adminSessions.delete(chatId)
    }
  }
})

// Réception de photo
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id
  if (!adminIds.includes(msg.from?.id!)) return
  const session = adminSessions.get(chatId)
  if (session && session.step === 'photo') {
    const photo = msg.photo![0]
    const fileId = photo.file_id
    const fileUrl = await bot.getFileLink(fileId)
    session.photo = fileUrl
    session.step = 'confirm'
    adminSessions.set(chatId, session)
    await sendConfirmation(chatId, session)
  }
})

async function sendConfirmation(chatId: number, session: any) {
  try {
    let country = await prisma.country.findUnique({ where: { name: session.countryName } })
    if (!country) {
      country = await prisma.country.create({
        data: {
          name: session.countryName,
          continent: 'AFRIQUE',
          flag: '🌍',
        },
      })
    }

    const scammer = await prisma.scammer.create({
      data: {
        name: session.name,
        phone: session.phone,
        countryId: country.id,
        description: session.description,
        dangerLevel: session.dangerLevel,
        photos: session.photo ? [session.photo] : [],
        facebookLink: session.socialLinks?.find((s: string) => s.includes('facebook')),
        telegramLink: session.socialLinks?.find((s: string) => s.includes('t.me')),
        whatsappLink: session.socialLinks?.find((s: string) => s.includes('wa.me')),
        otherLinks: session.socialLinks || [],
        approved: true,
      },
    })

    bot.sendMessage(chatId, `✅ Signalement ajouté avec succès !\nID : ${scammer.id}\nNom : ${scammer.name}\nPays : ${country.name}`, { parse_mode: 'Markdown' })
  } catch (e: any) {
    bot.sendMessage(chatId, `❌ Erreur : ${e.message}`)
  }
  adminSessions.delete(chatId)
}
