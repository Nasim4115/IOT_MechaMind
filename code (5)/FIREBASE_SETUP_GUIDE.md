# Firebase Setup Guide for Accessible E-Rickshaw

## Step 1: Add Environment Variables

Go to the **Vars** section in the left sidebar and add these variables:

### Client-side (Public) Variables
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=accessible-e-rickshaw.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=accessible-e-rickshaw
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://accessible-e-rickshaw-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=accessible-e-rickshaw.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
\`\`\`

### Server-side (Private) Variable
\`\`\`
FIREBASE_SERVICE_ACCOUNT_KEY=<paste-entire-JSON-key-file>
\`\`\`

## Step 2: Get Your Firebase Web Config

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **accessible-e-rickshaw** project
3. Click **Project Settings** (gear icon)
4. Scroll to **Your apps** section
5. If no web app, click **</> (Web)** icon to create one
6. Copy the config values

## Step 3: Find Missing Values

If you need `apiKey`, `messagingSenderId`, or `appId`:

1. In Firebase Console, go to **Project Settings**
2. Look for the web app configuration
3. Copy the values from the config object

## Step 4: Test Connection

Visit `/api/firebase-setup/check` in your browser to verify all connections are working.

## Step 5: Send IoT Data

Once setup is complete, send telemetry data to:

\`\`\`bash
POST /api/iot/save-telemetry
\`\`\`

Example:
\`\`\`bash
curl -X POST http://localhost:3000/api/iot/save-telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "GPS-001",
    "driverId": "DRV-001",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 45,
    "temperature": 65,
    "fuelLevel": 85,
    "status": "active"
  }'
\`\`\`

## Firebase Database Structure

Your data will be stored in this structure:

\`\`\`
accessible-e-rickshaw/
├── telemetry/
│   ├── GPS-001/
│   │   ├── 1699000000000/
│   │   │   ├── driverId: "DRV-001"
│   │   │   ├── latitude: 40.7128
│   │   │   ├── longitude: -74.0060
│   │   │   ├── speed: 45
│   │   │   ├── temperature: 65
│   │   │   ├── fuelLevel: 85
│   │   │   └── timestamp: 1699000000000
│   └── GPS-002/
│       └── ...
└── devices/
    ├── GPS-001/
    │   └── current/
    │       ├── driverId: "DRV-001"
    │       ├── latitude: 40.7128
    │       ├── longitude: -74.0060
    │       ├── speed: 45
    │       ├── temperature: 65
    │       ├── fuelLevel: 85
    │       ├── status: "active"
    │       └── lastUpdate: 1699000000000
    └── GPS-002/
        └── ...
\`\`\`

## Monitoring Dashboard

View real-time data at:
- `/dashboard/monitoring` - Live telemetry charts and device status
- `/dashboard/iot` - Vehicle tracking and alerts
- `/dashboard/analytics/iot-reports` - Historical analytics
