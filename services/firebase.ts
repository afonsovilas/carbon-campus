import Constants from 'expo-constants';
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
  const envHost = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST;
  const mobileEnvHost = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_MOBILE_HOST;
  const isLoopback = (h?: string) => !h || h === '127.0.0.1' || h === 'localhost';

  if (mobileEnvHost && !isLoopback(mobileEnvHost)) return mobileEnvHost;
  if (envHost && !isLoopback(envHost)) return envHost;

  const hostUri = Constants.expoConfig?.hostUri || (Constants.manifest as any)?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (!isLoopback(host)) return host;
  }

  // Emulator/simulator fallbacks: Android emulator uses 10.0.2.2, iOS simulator and web use loopback
  return Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
};

const emulatorHost = getEmulatorHost();
const firestorePort = Number(process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_PORT || '8080');

let app: any = null;
let db: any = null;
let auth: any = null;

if (isFirebaseConfigured && process.env.NODE_ENV !== 'test') {
  const { getApp, getApps, initializeApp } = require('firebase/app');
  const { getAuth, initializeAuth, getReactNativePersistence } = require('firebase/auth');
  const { connectFirestoreEmulator, getFirestore } = require('firebase/firestore');
  let connectAuthEmulator: any = null;
  try {
    connectAuthEmulator = require('firebase/auth').connectAuthEmulator;
  } catch (e) {
  }

  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }

  if (useFirestoreEmulator) {
    if (Platform.OS !== 'web' && (emulatorHost === '127.0.0.1' || emulatorHost === 'localhost')) {
      console.warn(
        '[firebase] Emulator host is set to a loopback address on a native platform. On a physical device this will point to the device itself, not your development machine.\n' +
          'If you are running on a physical device, set EXPO_PUBLIC_FIREBASE_EMULATOR_MOBILE_HOST or EXPO_PUBLIC_FIREBASE_EMULATOR_HOST to your computer\'s LAN IP (e.g. 192.168.x.x), or use Expo tunnel.\n' +
          'For Android emulator you can use 10.0.2.2. Falling back to configured host.'
      );
    }

    console.log(`🔌 Emulator: Ligando a http://${emulatorHost}:${firestorePort}`);
    connectFirestoreEmulator(db, emulatorHost, firestorePort);
    const authPort = Number(process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT || '9099');
    if (connectAuthEmulator && auth) {
      try {
        const authUrl = `http://${emulatorHost}:${authPort}`;
        console.log(`🔌 Auth Emulator: Ligando a ${authUrl}`);
        connectAuthEmulator(auth, authUrl);
      } catch (e) {
        console.warn('[firebase] Failed to connect to Auth emulator', e);
      }
    }
  }
}

export { app, auth, db };

