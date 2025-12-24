from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import uvicorn

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/search")
def search_address(q: str):
    if not q:
        return []
    
    url = "https://nominatim.openstreetmap.org/search"
    headers = {
        "User-Agent": "TripsXingApp/1.0" # Required by OSM usage policy
    }
    params = {
        "q": q,
        "format": "json",
        "addressdetails": 1,
        "limit": 5,
        "countrycodes": "in"
    }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error: {e}")
        return []

if __name__ == "__main__":
    print("Starting Address Server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
