import { bot } from './telegramBot'

// Chargement des handlers : ils vont s'attacher au bot importé ci-dessus
import '../../bot/handlers/admin'
import '../../bot/handlers/user'
import '../../bot/handlers/moderation'

console.log('Handlers Telegram enregistrés.')
