import requests

from app.config import SERVICE_URL, API_KEY
from app.utils import send_message_error


def add_order(service_id, quantity, link) -> dict:
    response = requests.get(SERVICE_URL, params={
        "key": API_KEY,
        'action': 'add',
        "service": service_id,
        "quantity": quantity,
        "link": link
    })
    result = response.json()
    print(result)
    if "error" in result:
        send_message_error(result["error"])
    return str(result)