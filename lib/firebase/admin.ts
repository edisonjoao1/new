import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let app: App | null = null
let db: Firestore | null = null

export function getFirebaseAdmin(): { app: App; db: Firestore } {
  if (app && db) {
    return { app, db }
  }

  const existingApps = getApps()

  if (existingApps.length > 0) {
    app = existingApps[0]
    db = getFirestore(app)
    return { app, db }
  }

  // Check for service account credentials
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT

  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set. Please add your Firebase service account JSON.')
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson)

    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    })

    db = getFirestore(app)

    return { app, db }
  } catch (error) {
    throw new Error(`Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function getFirestoreDb(): Firestore {
  return getFirebaseAdmin().db
}
