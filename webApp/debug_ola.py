import requests

client_id = "96dHZVzsAuuZzy6NNHD1EpNFyCqWRB2U13Aohm6rCD0LECBwmvunzlesX709savARS0olkIs5mF-PScxIDvZVA==".strip()
client_secret = "lrFxI-iSEg99beOv4CdWWz_d_zSVDo-ydBl_NZ95y-dOs4PCDClftJsqKOh4ozjKeHXP4T155IsO7ub9xxU5uWH8RMDg8bPt".strip()
api_key = "ed7bcf6ffc66a54231001106a228c3fa".strip()

print(f"Client ID length: {len(client_id)}")
print(f"Client Secret length: {len(client_secret)}")

# 1. Test Client Credentials Flow
token_url = "https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token"
data = {
    "grant_type": "client_credentials",
    "client_id": client_id,
    "client_secret": client_secret,
    "scope": "openid" 
}
try:
    print("\n--- Testing Token Endpoint ---")
    resp = requests.post(token_url, data=data)
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")
except Exception as e:
    print(f"Error: {e}")

# 2. Test Autocomplete with API Key
search_url = "https://api.olamaps.io/places/v1/autocomplete"
try:
    print("\n--- Testing Autocomplete (API Key) ---")
    resp = requests.get(search_url, params={"input": "Bangalore", "api_key": api_key})
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")
except Exception as e:
    print(f"Error: {e}")
