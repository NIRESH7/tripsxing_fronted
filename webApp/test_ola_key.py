import requests

api_key = "ed7bcf6ffc66a54231001106a228c3fa"
url = "https://api.olamaps.io/places/v1/autocomplete"
params = {"input": "Delhi"}

# Try query param
try:
    print("Testing api_key query param...")
    response = requests.get(url, params={**params, "api_key": api_key})
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(e)
    
# Try header X-API-KEY
try:
    print("\nTesting X-API-KEY header...")
    response = requests.get(url, params=params, headers={"X-API-KEY": api_key})
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(e)
    
# Try header api-key
try:
    print("\nTesting api-key header...")
    response = requests.get(url, params=params, headers={"api-key": api_key})
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(e)
