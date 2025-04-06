import json

import requests

from app.config import TG_GROUP_ID, TG_BOT_API_KEY, TG_ERROR_GROUP_ID


def send_message(message, keyboard=None):
    try:
        url = f"https://api.telegram.org/bot{TG_BOT_API_KEY}/sendMessage"
        params = {"chat_id": TG_GROUP_ID, "text": message}
        if keyboard:
            params["reply_markup"] = json.dumps(keyboard)
        requests.get(url, params=params)
    except Exception as e:
        print(e)


def send_message_error(message):
    try:
        url = f"https://api.telegram.org/bot{TG_BOT_API_KEY}/sendMessage"
        params = {"chat_id": TG_ERROR_GROUP_ID, "text": message}
        requests.get(url, params=params)
    except Exception as e:
        print(e)


def answer_callback_query(callback_id, message):
    url = f"https://api.telegram.org/bot{TG_BOT_API_KEY}/answerCallbackQuery"
    requests.post(url, json={"callback_query_id": callback_id, "text": message})


def hide_keyboard(message_id):
    url = f"https://api.telegram.org/bot{TG_BOT_API_KEY}/editMessageReplyMarkup"
    requests.post(url, json={
        "chat_id": TG_GROUP_ID,
        "message_id": message_id
    }).json()


