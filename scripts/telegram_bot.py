import requests
import sys
import os

def send_msg(text):
    token = os.environ.get("TELEGRAM_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    
    if not token or not chat_id:
        print("Error: Faltan credenciales de Telegram")
        return

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
    requests.post(url, json=payload)

if __name__ == "__main__":
    # Recibe el mensaje como argumento al ejecutar el script
    msg = sys.argv[1] if len(sys.argv) > 1 else "Notificación sin mensaje"
    send_msg(msg)