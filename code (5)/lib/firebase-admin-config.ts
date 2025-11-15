import * as admin from "firebase-admin"

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined

// Initialize Firebase Admin (server-side)
if (!admin.apps.length && serviceAccountKey) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export const adminDb = admin.database()
export const db = admin.database() // Add db export as alias for adminDb
export const adminAuth = admin.auth()
export default admin
