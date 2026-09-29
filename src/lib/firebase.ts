// Firebase bootstrap for the chat features.
//
// Supports both:
// 1. School Management / EndUser (project: elite-space-school)
// 2. Khaneypani Admin (project: water-bill-manager-dev)

import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { Auth, getAuth, signInAnonymously } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'

// Default / General config (used by Khaneypani)
const generalFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// School-specific config (used by EndUser School Management)
const schoolFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_SCHOOL_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_SCHOOL_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_SCHOOL_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_SCHOOL_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_SCHOOL_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_SCHOOL_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  generalFirebaseConfig.apiKey && generalFirebaseConfig.projectId && generalFirebaseConfig.appId
)

export const isSchoolFirebaseConfigured = Boolean(
  schoolFirebaseConfig.apiKey && schoolFirebaseConfig.projectId && schoolFirebaseConfig.appId
)

const initApp = (name: string, config: typeof generalFirebaseConfig): FirebaseApp | null => {
  if (!config.apiKey || !config.projectId || !config.appId) return null
  try {
    const existing = getApps().find((a) => a.name === name)
    if (existing) return existing
    return initializeApp(config, name === '[DEFAULT]' ? undefined : name)
  } catch (err) {
    console.error(`[Firebase] Error initializing ${name}:`, err)
    return null
  }
}

// Default app (Khaneypani)
export const firebaseApp = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(generalFirebaseConfig)
  : null

export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null
export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null

// School App / DB (EndUser)
export const schoolFirebaseApp = process.env.NEXT_PUBLIC_SCHOOL_FIREBASE_PROJECT_ID
  ? initApp('schoolApp', schoolFirebaseConfig)
  : firebaseApp

export const schoolDb: Firestore | null = schoolFirebaseApp ? getFirestore(schoolFirebaseApp) : db

export const ensureSignedIn = async (authInstance: Auth | null = firebaseAuth): Promise<void> => {
  if (!authInstance) return
  if (authInstance.currentUser) return
  try {
    await signInAnonymously(authInstance)
  } catch (err) {
    // If anonymous sign-in is not enabled or fails, don't crash if rules don't require it
    console.warn('[Firebase] Anonymous sign-in attempt warning:', (err as Error)?.message)
  }
}

export const signOutFirebase = async (authInstance: Auth | null = firebaseAuth): Promise<void> => {
  try {
    if (authInstance?.currentUser) await authInstance.signOut()
  } catch {
    // Ignore
  }
}
