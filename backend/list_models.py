import requests
import os
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
response = requests.get("https://api.groq.com/openai/v1/models", headers=headers)

if response.status_code == 200:
    for model in response.json()['data']:
        if "vision" in model['id'].lower() or "3.2" in model['id'].lower():
            print(model['id'])
else:
    print(response.text)
