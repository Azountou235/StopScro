import { bot } from '../../src/lib/telegramBot'
import { prisma } from '../../src/lib/prisma'

const adminIds = process.env.ADMIN_TELEGRAM_IDS?.split(',').map(Number) || []

bot.onText(/\/approve (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id
  if (!adminIds.includes(msg.from?.id!)) return
  const id = parseInt(match![1])
  await approveReport(chatId, id)
})

bot.onText(/\/reject (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id
  if (!adminIds.includes(msg.from?.id!)) return
  const id = parseInt(match![1])
  await rejectReport(chatId, id)
})

async function approveReport(chatId: number, id: number) {
  try {
    const report = await prisma.pendingReport.update({
      where: { id },
      data: { status: 'APPROVED' },
    })

    let country = await prisma.country.findUnique({ where: { name: report.countryName } })
    if (!country) {
      country = await prisma.country.create({
        data: { name: report.countryName, continent: 'AFRIQUE', flag: '🌍' },
      })
    }

    await prisma.scammer.create({
      data: {
        name: report.name,
        phone: report.phone,
        countryId: country.id,
        description: report.description,
        dangerLevel: report.dangerLevel,
        photos: report.photo ? [report.photo] : [],
        otherLinks: report.socialLinks,
        approved: true,
      },
    })

    bot.sendMessage(chatId, `✅ Signalement #${id} approuvé et ajouté à la base.`)
  } catch (e: any) {
    bot.sendMessage(chatId, `❌ Erreur : ${e.message}`)
  }
}

async function rejectReport(chatId: number, id: number) {
  try {
    await prisma.pendingReport.update({
      where: { id },
      data: { status: 'REJECTED' },
    })
    bot.sendMessage(chatId, `❌ Signalement #${id} rejeté.`)
  } catch (e: any) {
    bot.sendMessage(chatId, `❌ Erreur : ${e.message}`)
  }
}
