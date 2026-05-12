import { auth, isFirebaseConfigured } from '@/services/firebase';
import { Platform } from 'react-native';

type Unsubscribe = () => void;

export async function registerWithEmail(email: string, password: string): Promise<{ uid: string }> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Auth is not configured');
  }

  const { createUserWithEmailAndPassword } = require('firebase/auth');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  return { uid: userCredential.user.uid };
}

export async function loginWithEmail(email: string, password: string): Promise<{ uid: string }> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Auth is not configured');
  }

  const { signInWithEmailAndPassword } = require('firebase/auth');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  return { uid: userCredential.user.uid };
}

export function getCurrentUserUid(): string | null {
  if (!isFirebaseConfigured || !auth) {
    return null;
  }

  return auth.currentUser?.uid ?? null;
}

export function getCurrentUserEmail(): string | null {
  if (!isFirebaseConfigured || !auth) {
    return null;
  }

  return auth.currentUser?.email ?? null;
}

export async function signOutUser(): Promise<void> {
  if (!isFirebaseConfigured || !auth) {
    return;
  }

  const { signOut } = require('firebase/auth');

  try {
    await signOut(auth);
  } finally {
    if (Platform.OS === 'web') {
      clearFirebaseWebSession();
    }
  }
}

function clearFirebaseWebSession() {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKeys = new Set<string>();
  const storages = [window.localStorage, window.sessionStorage];

  for (const storage of storages) {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key) {
        continue;
      }

      if (key.startsWith('firebase:') || key.startsWith('firestore/') || key.includes('firebase')) {
        storageKeys.add(key);
      }
    }
  }

  for (const key of storageKeys) {
    try {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('[firebase] Failed to clear auth storage key', key, error);
    }
  }

  if (!('indexedDB' in window) || typeof indexedDB.databases !== 'function') {
    return;
  }

  indexedDB
    .databases()
    .then((databases) => {
      databases
        .filter((database) => typeof database.name === 'string' && database.name.toLowerCase().includes('firebase'))
        .forEach((database) => {
          if (!database.name) {
            return;
          }

          try {
            indexedDB.deleteDatabase(database.name);
          } catch (error) {
            console.warn('[firebase] Failed to delete indexedDB database', database.name, error);
          }
        });
    })
    .catch((error) => {
      console.warn('[firebase] Failed to inspect indexedDB databases', error);
    });
}

export function onAuthStateChange(handler: (uid: string | null) => void): Unsubscribe {
  if (!isFirebaseConfigured || !auth || process.env.NODE_ENV === 'test') {
    handler(null);
    return () => {};
  }

  const { onAuthStateChanged } = require('firebase/auth');

  return onAuthStateChanged(auth, (user: { uid: string } | null) => {
    handler(user?.uid ?? null);
  });
}
