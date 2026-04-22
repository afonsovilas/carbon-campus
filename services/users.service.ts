import { db, isFirebaseConfigured } from '@/services/firebase';

type UserProfile = {
  uid: string;
  email: string;
  tag: string;
  name: string;
  createdAt: number;
};

export type PublicUserProfile = {
  uid: string;
  name: string;
  tag: string;
};

function buildTagFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim().toLowerCase() || 'user';
  return `@${local}`;
}

function buildNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() || 'User';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export async function upsertUserProfile(uid: string, email: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  const { doc, setDoc } = require('firebase/firestore');

  const profile: UserProfile = {
    uid,
    email,
    tag: buildTagFromEmail(email),
    name: buildNameFromEmail(email),
    createdAt: Date.now(),
  };

  await setDoc(doc(db, 'users', uid), profile, { merge: true });
}

export async function findUserByTagFromCloud(tagInput: string): Promise<PublicUserProfile | null> {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  const { collection, getDocs, limit, query, where } = require('firebase/firestore');

  const normalizedTag = tagInput.startsWith('@') ? tagInput.toLowerCase() : `@${tagInput.toLowerCase()}`;
  const userQuery = query(collection(db, 'users'), where('tag', '==', normalizedTag), limit(1));
  const snapshot = await getDocs(userQuery);

  if (snapshot.empty) {
    return null;
  }

  const data = snapshot.docs[0].data() as { name?: string; tag?: string };
  const uid = snapshot.docs[0].id;

  return {
    uid,
    name: data.name || 'User',
    tag: data.tag || normalizedTag,
  };
}
