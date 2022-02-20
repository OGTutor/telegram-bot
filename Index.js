
const TelegramApi = require("node-telegram-bot-api")

const {gameOptions, againOptions} = require('./Options.js') 

const token = "5250938266:AAF8c3tvntQVQ6Rg0FI5lcXVOSSvFk2U89E"

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен будешь его отгадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Узнать всю поднаготную'},
        {command: '/game', description: 'Игра'},
    ])
    
    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id; 
        
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b6d/bc8/b6dbc819-573d-3876-a7f1-36d76d1f1a9f/2.webp');
            return bot.sendMessage(chatId, `Добро пожаловать!`);
        }
        if (text === '/info') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b6d/bc8/b6dbc819-573d-3876-a7f1-36d76d1f1a9f/1.webp');
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}!` + '\n' + `Твой ник ${msg.from.username}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        /*if (text === '/focus') {
            focus 'Предлагаю сыграть в игру! Правила довольно просты, последствия крайне страшны!')
            await bot.sendMessage(chatId, 'Ты веришь в чудеса? Нет? Тогда я вынужден тебя огорчить, потому что они на самом деле существуют! Сейчас я покажу тебе один фокус, он называется "Я читаю твои мыслы"!')
            await bot.sendMessage(chatId, 'Если готов продолжать ответь мне "Да"')
            await bot.sendMessage(chatId, "Да мне похуй продолжаем!")
            await bot.sendMessage(chatId, 'Перед тобой 6 карт выбери одну из них и запомни её!')
            await bot.sendSticker(chatId, 'blob:https://web.tlgrm.app/f211f790-86eb-453f-93fd-c4e2962137c6')
            await bot.sendSticker(chatId, 'blob:https://web.tlgrm.app/95cd6106-26cc-4e96-be5f-86421a23ec6d')
            await bot.sendSticker(chatId, 'blob:https://web.tlgrm.app/ddcce26c-4671-455a-828d-3473a9d8fca1')
            await bot.sendSticker(chatId, 'blob:https://web.tlgrm.app/5553d37a-226d-435d-9b7c-1321d5458973')
            await bot.sendSticker(chatId, 'blob:https://web.tlgrm.app/aca28898-bbbd-4640-a219-d04836cd6ef2')
            await bot.sendSticker(chatId, 'blob:https://web.tlgrm.app/844f979d-6001-4d1c-b01b-1820a0612f83')
        }*/
        return bot.sendMessage(chatId, 'Мы говорим на разных языках!');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Ты не угадал, я загадал цифру ${chats[chatId]}`, againOptions);
        }        
    })
}

start()