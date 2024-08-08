from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove, WebAppInfo
from telegram.ext import Application, ContextTypes, CommandHandler, MessageHandler, ConversationHandler, filters
from dotenv import load_dotenv
import amemcache
import asyncio
import os

load_dotenv()

HOST = '127.0.0.1'
PORT = 11211
telegram_api_key = os.getenv('TG_API')
application = Application.builder().token(telegram_api_key).build()


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    while True:
        acache = amemcache.aCacheClient(HOST, PORT)
        cached_orders = await acache.get('cached_orders')

        if cached_orders:
            for order in cached_orders:
                await context.bot.send_message(chat_id=1306750810, text=order)
            for order in cached_orders:
                await context.bot.send_message(chat_id=414902937, text=order)
            print('Заказы отправлены администраторам')

            await acache.set('cached_orders', [])
        else:
            print('Нет данных')

        await acache.close()
        await asyncio.sleep(5)


def main() -> None:
    application.add_handler(CommandHandler('startChecking128821', start))
    # application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    application.run_polling()


if __name__ == "__main__":
    try:
        print('Telegram bot\'s been started!')
        main()
    finally:
        print('Telegram bot\'s been stopped!')
