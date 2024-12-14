import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; // Import Leaflet.heat plugin
import "./Map.css"; // Optional: For custom styles

// Custom marker icon for monsters
const monsterIcon = new L.Icon({
  iconUrl: "/skulls.png", // Public folder reference
  iconSize: [30, 30], // Adjust size as needed
  iconAnchor: [15, 30], // Adjust the anchor for better positioning
});

const Map = () => {
  const [districts, setDistricts] = useState(null); // GeoJSON data for districts
  const [monsters, setMonsters] = useState([]); // Monsters data
  const [survivors, setSurvivors] = useState([]); // Survivors data

  useEffect(() => {
    // Fetch data from the public folder
    const fetchData = async () => {
      try {
        const districtRes = await fetch("/district_summary.geojson");
        const monstersRes = await fetch("/monsters.json");
        const survivorsRes = await fetch("/survivors.json");

        setDistricts(await districtRes.json());
        setMonsters(await monstersRes.json());
        setSurvivors(await survivorsRes.json());
      } catch (error) {
        console.error("Error loading data:", error.message);
      }
    };

    fetchData();
  }, []);

  // Define district styles
  const getDistrictStyle = (feature) => ({
    color: "blue",
    weight: 2,
    fillOpacity: 0.3,
  });

  // Prepare survivor heatmap data
  const survivorHeatmapPoints = survivors.map((survivor) => [
    survivor.lat,
    survivor.lon,
    1, // Intensity (adjust if needed)
  ]);

  const HeatmapLayer = ({ points }) => {
    const map = useMap();
    useEffect(() => {
      if (points.length > 0) {
        const heat = L.heatLayer(points, { radius: 60 }).addTo(map);
        return () => {
          map.removeLayer(heat); // Cleanup heatmap on 
        };
      }
    }, [points, map]);6

    return null;
  };

  return (
    <div className="map-container">
      <h1>Safety Map</h1>
      <MapContainer
        center={[20.5937, 78.9629]} // Center on India (example)
        zoom={5}
        style={{ height: "80vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Render District Boundaries */}
        {districts && (
          <GeoJSON
            data={districts}
            style={getDistrictStyle}
          />
        )}

        {/* Render Survivor Heatmap */}
        {survivorHeatmapPoints.length > 0 && (
          <HeatmapLayer points={survivorHeatmapPoints} />
        )}

        {/* Render Monster Markers */}
        {monsters.map((monster) => (
          <Marker
            key={monster.monster_id}
            position={[monster.lat, monster.lon]} // Ensure lat/lon are correct
            icon={monsterIcon}
          >
            <Popup>
              <strong>Monster ID:</strong> {monster.monster_id}
              <br />
              <strong>Location:</strong> {monster.lat.toFixed(2)}, {monster.lon.toFixed(2)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;