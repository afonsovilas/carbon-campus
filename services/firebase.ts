import Constants from 'expo-constants';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
export const useFirestoreEmulator = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

const getEmulatorHost = () => {
  if (process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST && process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST !== '127.0.0.1') {
    return process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST;
  }
  
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }

  return Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
};

const emulatorHost = getEmulatorHost();
const firestorePort = Number(process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_PORT || '8080');

const app = isFirebaseConfigured && (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig));
const db = getFirestore(app);
const auth = getAuth(app);

if (useFirestoreEmulator && isFirebaseConfigured) {
  console.log(`🔌 Emulator: Ligando a http://${emulatorHost}:${firestorePort}`);
  
  connectFirestoreEmulator(db, emulatorHost, firestorePort);

}

export { app, auth, db };

