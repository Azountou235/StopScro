import TelegramBot from 'node-telegram-bot-api'

export const adminMainKeyboard: TelegramBot.InlineKeyboardMarkup = {
  inline_keyboard: [
    [{ text: '📊 Tableau de bord', callback_data: 'dashboard' }],
    [{ text: '➕ Ajouter un signalement', callback_data: 'add_scammer' }],
    [{ text: '📋 Signalements en attente', callback_data: 'list_pending' }],
    [{ text: '✏️ Modifier un signalement', callback_data: 'edit_scammer' }],
    [{ text: '🗑 Supprimer un signalement', callback_data: 'delete_scammer' }],
    [{ text: '🌍 Liste des pays', callback_data: 'list_countries' }],
    [{ text: '📈 Statistiques', callback_data: 'stats' }],
    [{ text: '⚙️ Paramètres', callback_data: 'settings' }],
  ],
}

export const dangerLevelKeyboard: TelegramBot.InlineKeyboardMarkup = {
  inline_keyboard: [
    [{ text: '⚠️ Faible', callback_data: 'danger_FAIBLE' }],
    [{ text: '🔶 Moyen', callback_data: 'danger_MOYEN' }],
    [{ text: '🚨 Élevé', callback_data: 'danger_ELEVE' }],
  ],
}
