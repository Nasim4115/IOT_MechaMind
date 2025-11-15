# RideShare Admin Dashboard - E-Rickshaw Transportation System

A comprehensive real-time transportation management system for e-rickshaws with proximity-based rider-puller matching, IoT vehicle monitoring, and alert management.

## 🚀 Features

### Core Transportation System
- **Proximity-Based Matching**: Automatically matches riders with nearest available pullers using Haversine formula
- **Real-Time Alerts**: Wave-based notification system that alerts pullers in order of proximity
- **Race Condition Handling**: Atomic database operations prevent multiple pullers from accepting same ride
- **Smart Timeout Logic**: 
  - 10-second accept window per puller
  - 60-second total expiry with automatic cancellation
  - Red LED trigger on timeout for IoT devices
- **Multi-Request Distribution**: Handles multiple simultaneous ride requests without puller overlap
- **Re-Alert System**: Automatically notifies next nearest puller when ride is rejected/cancelled

### IoT Vehicle Monitoring
- Real-time GPS tracking and telemetry
- Live vehicle diagnostics dashboard
- Battery, speed, and health monitoring
- Alert system for critical device events
- WebSocket-based real-time data streaming

### Admin Dashboard
- Comprehensive analytics and reporting
- Driver/puller management
- Ride history and tracking
- User management
- Real-time monitoring panels

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account with:
  - Realtime Database enabled
  - Authentication enabled (Email/Password)
  - Service account credentials

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
npm install --legacy-peer-deps
\`\`\`

### 2. Firebase Setup

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Realtime Database** (Build → Realtime Database → Create Database)
4. Enable **Authentication** (Build → Authentication → Get Started → Email/Password)

#### B. Get Firebase Configuration

**Web App Config:**
1. Go to Project Settings → General
2. Scroll to "Your apps" → Add Web App (if not exists)
3. Copy the configuration values

**Admin SDK Credentials:**
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file

#### C. Configure Environment Variables

Create `.env.local` file in project root:

\`\`\`bash
# Client-side Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Server-side Firebase Admin Config
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
\`\`\`

### 3. Configure Firebase Realtime Database Rules

Go to Firebase Console → Realtime Database → Rules:

\`\`\`json
{
  "rules": {
    "rideRequests": {
      ".read": true,
      ".write": true,
      "$requestId": {
        ".indexOn": ["status", "riderId", "createdAt"]
      }
    },
    "pullerAlerts": {
      ".read": true,
      ".write": true,
      "$pullerId": {
        ".indexOn": ["status", "createdAt"]
      }
    },
    "pullers": {
      ".read": true,
      ".write": true,
      "$pullerId": {
        ".indexOn": ["available", "location"]
      }
    },
    "rides": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "vehicles": {
      ".read": "auth != null",
      ".write": true
    },
    "iot": {
      ".read": "auth != null",
      ".write": true
    }
  }
}
\`\`\`

Click **Publish** to save the rules.

### 4. Create Test Users

Go to Firebase Console → Authentication → Users → Add User:

**Admin User:**
- Email: `admin@accessible-e-rickshaw.com`
- Password: `admin123`

**Test Rider:**
- Email: `rider@test.com`
- Password: `rider123`

**Test Puller:**
- Email: `puller@test.com`
- Password: `puller123`

### 5. Run the Application

\`\`\`bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000
\`\`\`

## 📱 User Interfaces

### Rider Interface
**URL:** `http://localhost:3000/rider`

**Features:**
- Request ride with pickup location
- Real-time puller search status
- View active and past rides
- Cancel pending requests
- See matched puller details

### Puller Interface
**URL:** `http://localhost:3000/puller`

**Features:**
- Real-time ride alerts based on proximity
- Accept/reject ride requests
- View current location
- Toggle availability status
- See active rides and earnings

### Admin Dashboard
**URL:** `http://localhost:3000/dashboard`

**Features:**
- Real-time ride monitoring
- Driver/puller management
- Analytics and reports
- IoT vehicle monitoring
- User management

## 🧪 Testing the System

### Test Case 1: Single Ride Request
1. Open Puller interface in one browser tab
2. Open Rider interface in another tab
3. Rider requests a ride
4. Verify puller receives alert within seconds
5. Puller accepts the ride
6. Verify ride status updates in real-time

### Test Case 2: Multiple Pullers (Proximity Priority)
1. Open 3 puller interfaces with different locations
2. Rider requests ride
3. Verify nearest puller receives alert first
4. If nearest rejects, next puller gets notified
5. Continue until ride is accepted or expires

### Test Case 3: Race Condition
1. Open 2 puller interfaces
2. Rider requests ride
3. Both pullers try to accept simultaneously
4. Verify only one succeeds (atomic operation)
5. Other puller sees "Already accepted" message

### Test Case 4: Timeout Logic
1. Rider requests ride
2. Puller receives alert but doesn't respond
3. After 10 seconds, alert expires for that puller
4. Next nearest puller receives alert
5. If no response within 60 seconds total, request expires

### Test Case 5: Multiple Simultaneous Requests
1. Open 5 puller interfaces (all available)
2. Create 3 ride requests simultaneously
3. Verify each request distributed to different pullers
4. No single puller gets multiple alerts at once

### Test Case 6: Cancellation & Re-alert
1. Puller accepts ride
2. Puller cancels before pickup
3. Verify system re-alerts next nearest puller
4. Continue until new puller accepts

## 🏗️ System Architecture

### Database Schema

\`\`\`
Firebase Realtime Database
├── rideRequests/
│   ├── {requestId}/
│   │   ├── riderId: string
│   │   ├── riderLocation: {lat, lng, address}
│   │   ├── destination: {lat, lng, address}
│   │   ├── status: "pending"|"matched"|"accepted"|"expired"|"cancelled"
│   │   ├── acceptedBy: string | null
│   │   ├── notifiedPullers: string[]
│   │   ├── createdAt: timestamp
│   │   └── expiresAt: timestamp
│
├── pullerAlerts/
│   ├── {pullerId}/
│   │   ├── {alertId}/
│   │   │   ├── rideRequestId: string
│   │   │   ├── distance: number
│   │   │   ├── status: "pending"|"accepted"|"rejected"|"expired"
│   │   │   ├── expiresAt: timestamp
│   │   │   └── createdAt: timestamp
│
├── pullers/
│   ├── {pullerId}/
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── phone: string
│   │   ├── available: boolean
│   │   ├── location: {lat, lng}
│   │   ├── currentRideId: string | null
│   │   └── lastUpdated: timestamp
│
└── rides/
    ├── {rideId}/
    │   ├── riderId: string
    │   ├── pullerId: string
    │   ├── status: "active"|"completed"|"cancelled"
    │   ├── pickup: location
    │   ├── destination: location
    │   ├── startTime: timestamp
    │   └── endTime: timestamp
\`\`\`

### Proximity Algorithm

Uses **Haversine formula** to calculate distance between two GPS coordinates:

\`\`\`typescript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}
\`\`\`

### Wave-Based Alert Distribution

1. Calculate distances from rider to all available pullers
2. Sort pullers by distance (nearest first)
3. Alert nearest puller (Wave 1)
4. Set 10-second timer
5. If no response, alert next puller (Wave 2)
6. Continue until accepted or 60-second total timeout
7. Use Firebase transactions for atomic updates

## 🔧 API Endpoints

### POST `/api/rides/create`
Creates a new ride request and initiates alert distribution.

**Request Body:**
\`\`\`json
{
  "riderId": "string",
  "riderLocation": {"lat": number, "lng": number, "address": "string"},
  "destination": {"lat": number, "lng": number, "address": "string"}
}
\`\`\`

### POST `/api/rides/accept`
Puller accepts a ride (atomic operation).

**Request Body:**
\`\`\`json
{
  "rideRequestId": "string",
  "pullerId": "string"
}
\`\`\`

### POST `/api/rides/reject`
Puller rejects a ride, triggers next wave alert.

**Request Body:**
\`\`\`json
{
  "rideRequestId": "string",
  "pullerId": "string"
}
\`\`\`

### POST `/api/rides/cancel`
Cancels active ride and re-alerts next puller.

**Request Body:**
\`\`\`json
{
  "rideId": "string",
  "cancelledBy": "rider"|"puller"
}
\`\`\`

## 🐛 Troubleshooting

### "Module not found: Can't resolve 'react-is'"
\`\`\`bash
npm install react-is --legacy-peer-deps
\`\`\`

### Firebase Connection Issues
1. Verify all environment variables are set correctly
2. Check Firebase Realtime Database rules are published
3. Ensure service account has proper permissions
4. Restart development server after env changes

### Alerts Not Appearing
1. Check browser console for errors
2. Verify puller's `available` status is `true`
3. Ensure puller location is set in database
4. Check Firebase Realtime Database connection

### Race Condition Errors
- System uses Firebase transactions - already handled
- Check browser console for transaction failure logs
- Verify database rules allow writes

## 📚 Additional Resources

- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [Next.js Documentation](https://nextjs.org/docs)
- [Haversine Formula Explanation](https://en.wikipedia.org/wiki/Haversine_formula)

## 🤝 Support

For issues or questions, please check:
1. This README
2. `FIREBASE_SETUP_GUIDE.md`
3. `RIDE_ALERT_SYSTEM_DOCS.md`

## 📄 License

[Your License Here]
