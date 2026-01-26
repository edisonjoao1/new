import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage, Storage } from 'firebase-admin/storage'

let app: App | null = null
let db: Firestore | null = null
let storage: Storage | null = null

const STORAGE_BUCKET = 'inteligencia-artificial-6a543.firebasestorage.app'

export function getFirebaseAdmin(): { app: App; db: Firestore; storage: Storage } {
  if (app && db && storage) {
    return { app, db, storage }
  }

  const existingApps = getApps()

  if (existingApps.length > 0) {
    app = existingApps[0]
    db = getFirestore(app)
    storage = getStorage(app)
    return { app, db, storage }
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
      storageBucket: STORAGE_BUCKET,
    })

    db = getFirestore(app)
    storage = getStorage(app)

    return { app, db, storage }
  } catch (error) {
    throw new Error(`Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function getFirestoreDb(): Firestore {
  return getFirebaseAdmin().db
}

export function getFirebaseStorage(): Storage {
  return getFirebaseAdmin().storage
}

export { STORAGE_BUCKET }
