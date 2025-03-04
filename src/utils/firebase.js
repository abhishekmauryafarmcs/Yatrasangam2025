import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ]

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  }

  console.log('Firebase Config:', {
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket
  })

  const missingFields = requiredFields.filter(field => !config[field])
  if (missingFields.length > 0) {
    throw new Error(`Missing Firebase configuration fields: ${missingFields.join(', ')}`)
  }

  return config
}

const firebaseConfig = validateFirebaseConfig()

// Initialize Firebase
let app
try {
  app = initializeApp(firebaseConfig)
  console.log('Firebase app initialized successfully')
} catch (error) {
  console.error('Error initializing Firebase app:', error)
  throw error
}

// Initialize services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Check if Firebase is properly initialized
const checkFirebaseInitialization = () => {
  if (!auth) {
    throw new Error('Firebase Authentication not initialized')
  }
  if (!db) {
    throw new Error('Firebase Firestore not initialized')
  }
  if (!storage) {
    throw new Error('Firebase Storage not initialized')
  }
  return true
}

// Test Firebase connection
const testFirebaseConnection = async () => {
  try {
    checkFirebaseInitialization()
    console.log('Firebase services initialized successfully:', {
      auth: !!auth,
      db: !!db,
      storage: !!storage,
      currentUser: auth.currentUser
    })
    return true
  } catch (error) {
    console.error('Firebase initialization error:', error)
    return false
  }
}

// Export initialized services and utilities
export {
  auth,
  db,
  storage,
  testFirebaseConnection,
  checkFirebaseInitialization
}

export default app 