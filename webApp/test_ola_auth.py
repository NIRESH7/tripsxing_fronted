import requests

client_id = "96dHZVzsAuuZzy6NNHD1EpNFyCqWRB2U13Aohm6rCD0LECBwmvunzlesX709savARS0olkIs5mF-PScxIDvZVA=="
client_secret = "lrFxI-iSEg99beOv4CdWWz_d_zSVDo-ydBl_NZ95y-dOs4PCDClftJsqKOh4ozjKeHXP4T155IsO7ub9xxU5uWH8RMDg8bPt"
token_url = "https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token"

data = {
    "grant_type": "client_credentials",
    "client_id": client_id,
    "client_secret": client_secret
}

print(f"Testing credentials against {token_url}...")
try:
    response = requests.post(token_url, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
