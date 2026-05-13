import { db, isFirebaseConfigured } from '@/services/firebase';

export const DEFAULT_COURSE = 'Sem curso';
export const PUBLIC_LEADERBOARD_COLLECTION = 'leaderboardEntries';

export type UserProfile = {
  uid: string;
  email: string;
  tag: string;
  name: string;
  bio: string;
  avatarEmoji: string;
  course: string;
  points: number;
  createdAt: number;
  updatedAt?: number;
};

export type PublicUserProfile = {
  uid: string;
  name: string;
  tag: string;
  course: string;
};

export type PublicLeaderboardEntry = PublicUserProfile & {
  points: number;
  updatedAt: number;
};

function buildDefaultProfile(uid: string, email: string): UserProfile {
  return {
    uid,
    email,
    tag: buildTagFromEmail(email),
    name: buildNameFromEmail(email),
    bio: '',
    avatarEmoji: '🧑',
    course: DEFAULT_COURSE,
    points: 0,
    createdAt: Date.now(),
  };
}

function normalizeProfile(uid: string, data: Partial<UserProfile> & { email?: string }): UserProfile {
  const email = data.email || `${uid}@fe.up.pt`;

  const profile: UserProfile = {
    uid,
    email,
    tag: data.tag || buildTagFromEmail(email),
    name: data.name || buildNameFromEmail(email),
    bio: data.bio || '',
    avatarEmoji: data.avatarEmoji || '🧑',
    course: data.course || DEFAULT_COURSE,
    points: typeof data.points === 'number' ? data.points : 0,
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
  };

  if (typeof data.updatedAt === 'number') {
    profile.updatedAt = data.updatedAt;
  }

  return profile;
};

function buildTagFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim().toLowerCase() || 'user';
  return `@${local}`;
}

function buildNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() || 'User';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function buildPublicLeaderboardEntry(profile: Partial<UserProfile> & { uid: string; points?: number }): PublicLeaderboardEntry {
  return {
    uid: profile.uid,
    name: profile.name || 'User',
    tag: profile.tag || '@user',
    course: profile.course || DEFAULT_COURSE,
    points: typeof profile.points === 'number' ? profile.points : 0,
    updatedAt: Date.now(),
  };
}

export async function syncPublicLeaderboardEntry(uid: string, fields: Partial<PublicLeaderboardEntry>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  const { doc, setDoc } = require('firebase/firestore');
  const leaderboardRef = doc(db, PUBLIC_LEADERBOARD_COLLECTION, uid);
  await setDoc(leaderboardRef, {
    ...fields,
    uid,
    updatedAt: Date.now(),
  }, { merge: true });
}

export async function upsertUserProfile(uid: string, emailOrFields: string | Partial<UserProfile>): Promise<UserProfile> {
  if (!isFirebaseConfigured || !db) {
    return normalizeProfile(uid, typeof emailOrFields === 'string' ? { email: emailOrFields } : emailOrFields);
  }

  const { doc, getDoc, setDoc } = require('firebase/firestore');

  const existingSnapshot = await getDoc(doc(db, 'users', uid));
  const incoming = typeof emailOrFields === 'string' ? { email: emailOrFields } : emailOrFields;

  if (!existingSnapshot.exists()) {
    const email = incoming.email || `${uid}@fe.up.pt`;
    const profile = normalizeProfile(uid, { ...buildDefaultProfile(uid, email), ...incoming });
    await setDoc(doc(db, 'users', uid), profile);
    syncPublicLeaderboardEntry(uid, buildPublicLeaderboardEntry(profile)).catch((err) =>
      console.warn('Failed to sync leaderboard entry:', err)
    );
    return profile;
  }

  const profile = normalizeProfile(uid, {
    ...(existingSnapshot.data() as Partial<UserProfile>),
    ...incoming,
    updatedAt: Date.now(),
  });

  await setDoc(doc(db, 'users', uid), profile, { merge: true });
  syncPublicLeaderboardEntry(uid, buildPublicLeaderboardEntry(profile)).catch((err) =>
    console.warn('Failed to sync leaderboard entry:', err)
  );
  return profile;
}

export async function updateUserProfile(uid: string, fields: Partial<UserProfile>): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  const { doc, getDoc, setDoc } = require('firebase/firestore');
  const profileRef = doc(db, 'users', uid);
  const payload = {
    ...fields,
    updatedAt: Date.now(),
  };

  await setDoc(profileRef, payload, { merge: true });
  const snapshot = await getDoc(profileRef);
  if (snapshot.exists()) {
    const currentProfile = snapshot.data() as Partial<UserProfile>;
    await syncPublicLeaderboardEntry(uid, {
      name: (fields.name || currentProfile.name || 'User'),
      tag: (fields.tag || currentProfile.tag || '@user'),
      course: (fields.course || currentProfile.course || DEFAULT_COURSE),
    });
  }
  return fetchUserProfileFromCloud(uid);
}

export async function ensureUserProfile(uid: string, email: string): Promise<UserProfile> {
  const profile = await fetchUserProfileFromCloud(uid);
  if (profile) {
    return profile;
  }

  return upsertUserProfile(uid, email);
}

export async function fetchUserProfileFromCloud(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  const { doc, getDoc } = require('firebase/firestore');
  const snapshot = await getDoc(doc(db, 'users', uid));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeProfile(uid, snapshot.data() as Partial<UserProfile>);
}

export async function fetchAllUserProfilesFromCloud(): Promise<UserProfile[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  const { collection, getDocs } = require('firebase/firestore');
  const snapshot = await getDocs(collection(db, 'users'));

  return snapshot.docs.map((entry: any) => normalizeProfile(entry.id, entry.data() as Partial<UserProfile>));
}

export async function fetchPublicLeaderboardEntriesFromCloud(): Promise<PublicLeaderboardEntry[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  const { collection, getDocs } = require('firebase/firestore');
  const snapshot = await getDocs(collection(db, PUBLIC_LEADERBOARD_COLLECTION));

  return snapshot.docs.map((entry: any) => {
    const data = entry.data() as Partial<PublicLeaderboardEntry>;
    return {
      uid: entry.id,
      name: data.name || 'User',
      tag: data.tag || '@user',
      course: data.course || DEFAULT_COURSE,
      points: typeof data.points === 'number' ? data.points : 0,
      updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : 0,
    };
  });
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
    course: DEFAULT_COURSE,
  };
}
