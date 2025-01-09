# Dashboard Application

## Overview
This repository contains the code for a Dashboard application that provides the following features:

- **Authentication**: User registration and login with role-based access (user/admin).
- **Trade Management**: Users can offer items for trade, initiate trades, and manage trade statuses (accept/reject).
- **Announcements**: Users can post, fetch, and delete broadcast announcements.

---

## Features

### Authentication
- **Signup**: Users can register with a username, email, and password. Passwords are securely hashed using `bcrypt`.
- **Login**: Users can log in with email and password to obtain a JSON Web Token (JWT).
- **Role-Based Access**: Special admin privileges are granted based on the email defined in the `.env` file.

### Announcement/Broadcasts
- **Create Broadcast**: Users can add announcements with a minimum length requirement for the message.
- **Fetch Broadcasts**: Fetch all announcements.
--**Only Admin can delete broadcast**: Delete Broadcast

### Trade Management
- **Offer Items**: Users can list items for trade with descriptions.
- **Initiate Trade**: Users can propose trades with other users.
- **Trade Decisions**: Accept or reject trade offers.
- **Trade Status**: Manage the trade statuses (accepted/rejected/pending).

---

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT) and bcrypt for password hashing.
- **Validation**: express-validator for input validation.

---

## Endpoints

### Authentication Routes

#### POST `/signup`
**Description**: Register a new user.

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "success": true,
  "token": "string",
  "role": "user"
}
```

---

#### POST `/login`
**Description**: Log in a user.

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "success": true,
  "token": "string",
  "role": "user | admin"
}
```

---

### Broadcast Routes

#### POST `/add`
**Description**: Add a new broadcast (announcement).

**Request Body**:
```json
{
  "text": "string"
}
```

**Response**:
```json
{
  "success": true,
  "msg": "Broadcast has been added successfully",
  "broadcast": {}
}
```

---

#### DELETE `/delete/:id`
**Description**: Delete a broadcast by ID.

**Response**:
```json
{
  "success": true
}
```

---

#### GET `/render`
**Description**: Fetch all broadcasts.

**Response**:
```json
{
  "success": true,
  "broadcasts": []
}
```

---

### Trade Routes

#### POST `/offer-item`
**Description**: Offer a new item for trade.

**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "requestedItem": "string (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Item successfully offered for trade.",
  "item": {}
}
```

---

#### POST `/initiate-trade`
**Description**: Initiate a trade with another user.

**Request Body**:
```json
{
  "itemId": "string",
  "offeredId": "string"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Trade offer sent to username"
}
```

---

#### POST `/accept-reject-trade`
**Description**: Accept or reject a trade offer.

**Request Body**:
```json
{
  "tradeOfferId": "string",
  "decision": "accept | reject"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Trade accepted!"
}
```

---

## Environment Variables

| Variable       | Description                           |
|----------------|---------------------------------------|
| `PORT`         | Port number for the server            |
| `MONGO_URI`    | MongoDB connection string             |
| `JWT_SECRET`   | Secret key for signing JWTs           |
| `ADMIN_EMAIL`  | Email to identify the admin role      |

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. Navigate to the project directory:
   ```bash
   cd your-repo
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your-mongo-uri
   JWT_SECRET=your-jwt-secret
   ADMIN_EMAIL=admin@example.com
   ```

5. Start the server:
   ```bash
   npm start
   ```


# Project: Safety Map and Resource Visualization

## Overview
The Safety Map project provides a comprehensive platform for visualizing key resources, survivors, and potential threats in a geographical area. By integrating backend data processing with a React-based interactive map, this application offers users an intuitive way to assess safety and coordinate resources.

## Features
- **Backend Data Processing**:
  - Fetch and process data from RESTful APIs.
  - Transform geographical data into GeoJSON for mapping.
  - Save processed data for frontend use in JSON and GeoJSON formats.
  - Handle errors and validate data integrity.

- **Frontend Map Visualization**:
  - Interactive map built with React and Leaflet.
  - Displays district boundaries, survivor heatmaps, and monster markers.
  - Custom icons and styles for dynamic visualization.
  - Heatmap layer to highlight survivor densities.

## Technologies Used
- **Backend**:
  - Python: Pandas, GeoPandas, Requests, OS libraries.
  - Data export in GeoJSON and JSON formats.
- **Frontend**:
  - React: State management, data fetching, and rendering.
  - Leaflet: Mapping, layers, markers, and heatmaps.
  - GeoJSON: To render district boundaries.

---

## Backend Data Processing

### Files:
- **`data_processing.py`**
  - Fetches data from RESTful endpoints:
    - `/resources`: GeoJSON format data for resources (district boundaries).
    - `/survivors`: List of survivors with latitude and longitude.
    - `/monsters`: List of monster locations with latitude, longitude, and IDs.

### Workflow:
1. **Fetch Data:**
   - Use the `requests` library to make GET requests to the API endpoints.

2. **Transform Data:**
   - Convert resources data into a GeoDataFrame (GeoPandas) and validate columns.
   - Convert survivors and monsters into Pandas DataFrames for further processing.

3. **Save Data:**
   - Save processed data in the `data/` directory as:
     - `district_summary.geojson`: For district boundaries.
     - `survivors.json`: For survivor locations.
     - `monsters.json`: For monster locations.

4. **Error Handling:**
   - Validate presence of critical columns (e.g., `dist_name`, `lat`, `lon`).
   - Raise appropriate exceptions for missing or invalid data.

---

## Frontend Implementation

### Files:
- **`Map.js`**: Contains the Safety Map React component.

### Features:
1. **Data Fetching:**
   - Fetch data from public folder files (`district_summary.geojson`, `survivors.json`, `monsters.json`).
   - Load data into state variables for rendering.

2. **Map Layers:**
   - **District Boundaries:** Rendered using GeoJSON data with customizable styles.
   - **Survivor Heatmap:** Created using `leaflet.heat` to display survivor densities.
   - **Monster Markers:** Rendered using custom marker icons with popups.

3. **Custom Styles:**
   - District boundaries styled with a blue outline and semi-transparent fill.
   - Custom icons (`skulls.png`) used for monsters.

### Key Code Snippets:
#### Survivor Heatmap:
```javascript
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
        map.removeLayer(heat); // Cleanup heatmap on unmount
      };
    }
  }, [points, map]);

  return null;
};
```

#### Monster Markers:
```javascript
const monsterIcon = new L.Icon({
  iconUrl: "/skulls.png", // Public folder reference
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

monsters.map((monster) => (
  <Marker
    key={monster.monster_id}
    position={[monster.lat, monster.lon]}
    icon={monsterIcon}
  >
    <Popup>
      <strong>Monster ID:</strong> {monster.monster_id}
      <br />
      <strong>Location:</strong> {monster.lat.toFixed(2)}, {monster.lon.toFixed(2)}
    </Popup>
  </Marker>
));
```

---

## Project Setup

### Prerequisites:
- Python 3.x (with Pandas, GeoPandas installed)
- Node.js (for React frontend)
- MongoDB (optional for backend API data storage)

### Backend Setup:
1. Install required Python packages:
   ```bash
   pip install pandas geopandas requests
   ```
2. Run the data processing script:
   ```bash
   python data_processing.py
   ```
3. Verify the output files in the `data/` directory:
   - `district_summary.geojson`
   - `survivors.json`
   - `monsters.json`

### Frontend Setup:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. Place the output files (`district_summary.geojson`, `survivors.json`, `monsters.json`) in the `public/` directory.

---

## Folder Structure
```
project-directory/
├── backend/
│   ├── data_processing.py
│   └── data/
│       ├── district_summary.geojson
│       ├── survivors.json
│       └── monsters.json
├── frontend/
│   ├── public/
│   │   ├── district_summary.geojson
│   │   ├── survivors.json
│   │   └── monsters.json
│   ├── src/
│   │   ├── components/
│   │   │   └── Map.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## Future Improvements
- Implement real-time updates for survivor and monster locations.
- Integrate a cloud database (e.g., MongoDB Atlas) for better scalability.
- P2P communication feature between citizens can be added.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

