import pandas as pd
import geopandas as gpd
import requests
import os

BASE_URL = "https://api.mlsakiit.com"
output_dir = "data"
os.makedirs(output_dir, exist_ok=True)

def fetch_data(endpoint):
    response = requests.get(f"{BASE_URL}{endpoint}")
    response.raise_for_status()
    return response.json()

try:
    # Fetch data
    resources_data = fetch_data("/resources")
    survivors_data = fetch_data("/survivors")
    monsters_data = fetch_data("/monsters")

    # Convert resources GeoJSON to GeoDataFrame
    resources = gpd.GeoDataFrame.from_features(resources_data["features"], crs="EPSG:4326")

    # Check if 'dist_name' column exists
    if "dist_name" not in resources.columns:
        raise ValueError("'dist_name' column not found in resources data")

    # Convert survivors to DataFrame
    survivors = pd.DataFrame(survivors_data)
    if not {"lat", "lon"}.issubset(survivors.columns):
        raise ValueError("'lat' and 'lon' columns not found in survivors data")

    # Flatten monsters
    monsters_list = [
        {"monster_id": m["monster_id"], "lon": m["lon"], "lat": m["lat"]}
        for m in monsters_data.get("monsters", [])
    ]
    monsters = pd.DataFrame(monsters_list)
    if monsters.empty:
        raise ValueError("No monsters data available")

    # Save survivors and monsters as JSON for frontend use
    survivors[["lat", "lon"]].to_json(f"{output_dir}/survivors.json", orient="records")
    monsters[["monster_id", "lat", "lon"]].to_json(f"{output_dir}/monsters.json", orient="records")

    # Save resources (district boundaries) for map
    resources.to_file(f"{output_dir}/district_summary.geojson", driver="GeoJSON")

    print("Data processing complete. Results saved.")

except Exception as e:
    print(f"Error during data processing: {e}")
