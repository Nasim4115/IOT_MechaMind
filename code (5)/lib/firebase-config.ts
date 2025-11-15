import { initializeApp, getApps, getApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

const isConfigured = firebaseConfig.projectId && firebaseConfig.databaseURL && firebaseConfig.apiKey

let app: any = null
let database: any = null
let auth: any = null
let storage: any = null

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    database = getDatabase(app)
    auth = getAuth(app)
    storage = getStorage(app)
  } catch (error) {
    console.error("[v0] Firebase initialization error:", error)
  }
}

export { app, database, auth, storage, isConfigured }
export default app
