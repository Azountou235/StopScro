import { bot } from '../../src/lib/telegramBot'
import { prisma } from '../../src/lib/prisma'
import { dangerLevelKeyboard } from '../keyboards'

const userSessions = new Map<number, any>()

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, '🛡️ *StopScro*\n\nBienvenue ! Ce bot vous permet de signaler une arnaque suspecte.\nUtilisez /report pour commencer.', { parse_mode: 'Markdown' })
})

bot.onText(/\/report/, (msg) => {
  const chatId = msg.chat.id
  userSessions.set(chatId, { step: 'name' })
  bot.sendMessage(chatId, '✏️ Entrez le *nom ou pseudo* de l\'arnaqueur :', { parse_mode: 'Markdown' })
})

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text
  if (!text || text.startsWith('/')) return

  const session = userSessions.get(chatId)
  if (!session) return

  if (session.step === 'name') {
    session.name = text
    session.step = 'phone'
    bot.sendMessage(chatId, '📞 Entrez le *numéro de téléphone* (ou "non") :', { parse_mode: 'Markdown' })
    userSessions.set(chatId, session)
  }
  else if (session.step === 'phone') {
    session.phone = text === 'non' ? null : text
    session.step = 'country'
    bot.sendMessage(chatId, '🌍 Entrez le *pays* :', { parse_mode: 'Markdown' })
    userSessions.set(chatId, session)
  }
  else if (session.step === 'country') {
    session.countryName = text
    session.step = 'description'
    bot.sendMessage(chatId, '📝 Entrez la *description* :', { parse_mode: 'Markdown' })
    userSessions.set(chatId, session)
  }
  else if (session.step === 'description') {
    session.description = text
    session.step = 'danger'
    bot.sendMessage(chatId, '⚠️ Choisissez le *niveau de danger* :', { reply_markup: dangerLevelKeyboard })
    userSessions.set(chatId, session)
  }
  else if (session.step === 'social') {
    session.socialLinks = text.split(',').map((s: string) => s.trim()).filter(Boolean)
    session.step = 'photo'
    bot.sendMessage(chatId, '📸 Envoyez une *photo ou capture* (ou "non") :', { parse_mode: 'Markdown' })
    userSessions.set(chatId, session)
  }
  else if (session.step === 'photo') {
    if (text === 'non') {
      session.photo = null
      await savePendingReport(chatId, session, msg.from?.id?.toString())
      userSessions.delete(chatId)
    } else {
      bot.sendMessage(chatId, 'Veuillez envoyer une photo ou écrire "non".')
    }
  }
})

// Callback pour le danger
bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id
  if (!chatId) return
  const data = query.data
  if (!data || !data.startsWith('danger_')) return

  const session = userSessions.get(chatId)
  if (session && session.step === 'danger') {
    const level = data.replace('danger_', '') as 'FAIBLE' | 'MOYEN' | 'ELEVE'
    session.dangerLevel = level
    session.step = 'social'
    bot.sendMessage(chatId, '🔗 Entrez les *liens des réseaux sociaux* séparés par des virgules :', { parse_mode: 'Markdown' })
    userSessions.set(chatId, session)
    bot.answerCallbackQuery(query.id)
  }
})

// Photo utilisateur
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id
  const session = userSessions.get(chatId)
  if (session && session.step === 'photo') {
    const fileId = msg.photo![0].file_id
    const fileUrl = await bot.getFileLink(fileId)
    session.photo = fileUrl
    await savePendingReport(chatId, session, msg.from?.id?.toString())
    userSessions.delete(chatId)
  }
})

async function savePendingReport(chatId: number, session: any, userId?: string) {
  try {
    await prisma.pendingReport.create({
      data: {
        name: session.name,
        phone: session.phone,
        countryName: session.countryName,
        description: session.description,
        dangerLevel: session.dangerLevel,
        socialLinks: session.socialLinks || [],
        photo: session.photo,
        reporterId: userId,
        status: 'PENDING',
      },
    })
    bot.sendMessage(chatId, '✅ Votre signalement a été soumis. Il sera examiné par un administrateur.')
  } catch (e: any) {
    bot.sendMessage(chatId, `❌ Erreur : ${e.message}`)
  }
}
