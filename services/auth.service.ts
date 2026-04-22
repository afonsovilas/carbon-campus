import { auth, isFirebaseConfigured } from '@/services/firebase';

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
