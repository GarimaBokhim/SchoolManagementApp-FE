// Firebase bootstrap for the khaneypaniadmin chat.
//
// Points at the same `water-bill-manager-dev` project the Flutter app uses, so
// a thread started on the web is the same document the mobile client reads.
// See src/app/khaneypaniadmin/chat/types/IChat.tsx for the shared data contract.

import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { Auth, getAuth, signInAnonymously } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/** False when the NEXT_PUBLIC_FIREBASE_* vars are missing, so the chat page can
 *  say so plainly instead of throwing an opaque Firebase error on mount. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
)

// getApps() guard: Next's fast refresh re-runs this module, and a second
// initializeApp with the same name throws.
const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

export const firebaseApp = app
export const db: Firestore | null = app ? getFirestore(app) : null
export const firebaseAuth: Auth | null = app ? getAuth(app) : null

/**
 * Signs in anonymously if there is no Firebase user yet.
 *
 * The web app authenticates against the ASP.NET API, not Firebase, so there is
 * no Firebase identity until one is made here. Firestore rules only reason
 * about `request.auth`, and the deployed rules require `request.auth != null`
 * for every chat read and write — without this call every query fails with
 * permission-denied. This mirrors ChatRepository.ensureSignedIn in the Flutter
 * app (lib/app/app_core/features/chat/data/chat_repository.dart).
 *
 * The anonymous uid has NO relation to the app's user id, so it proves only
 * "some client", never "this user". Identity still travels as plain document
 * data (`senderId`, `participants`). Closing that gap needs a backend endpoint
 * minting a Firebase custom token via the Admin SDK with uid = the JWT `sub`;
 * then this becomes signInWithCustomToken and the participant-scoped rules
 * already commented into firestore.rules can be switched on.
 */
export const ensureSignedIn = async (): Promise<void> => {
  if (!firebaseAuth) {
    throw new Error(
      'Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* variables in .env'
    )
  }
  if (firebaseAuth.currentUser) return
  await signInAnonymously(firebaseAuth)
}

/** Drops the Firebase identity on logout so the next user on a shared machine
 *  does not inherit the previous one's listeners. */
export const signOutFirebase = async (): Promise<void> => {
  try {
    if (firebaseAuth?.currentUser) await firebaseAuth.signOut()
  } catch {
    // Never block logout on Firebase.
  }
}
