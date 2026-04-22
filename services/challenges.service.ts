import { getCurrentUserUid } from '@/services/auth.service';
import { db, isFirebaseConfigured } from '@/services/firebase';

export interface UserChallenge {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  participants: string[];
  createdAt: number;
}

export async function createChallengeInCloud(input: {
  name: string;
  startDate: string;
  endDate: string;
}): Promise<UserChallenge | null> {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  const uid = getCurrentUserUid();
  if (!uid) {
    return null;
  }

  const { addDoc, collection } = require('firebase/firestore');

  const payload = {
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    participants: [],
    createdAt: Date.now(),
  };

  const ref = await addDoc(collection(db, 'users', uid, 'challenges'), payload);

  return {
    id: ref.id,
    ...payload,
  };
}

export async function fetchChallengesFromCloud(): Promise<UserChallenge[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  const uid = getCurrentUserUid();
  if (!uid) {
    return [];
  }

  const { collection, getDocs, orderBy, query } = require('firebase/firestore');
  const challengesQuery = query(
    collection(db, 'users', uid, 'challenges'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(challengesQuery);

  return snapshot.docs.map((docItem: any) => {
    const data = docItem.data() as Partial<UserChallenge>;

    return {
      id: docItem.id,
      name: data.name ?? 'Challenge',
      startDate: data.startDate ?? '',
      endDate: data.endDate ?? '',
      participants: Array.isArray(data.participants) ? data.participants : [],
      createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
    };
  });
}

export async function sendChallengeInviteToCloud(input: {
  challengeId: string;
  challengeName: string;
  friendTag: string;
  friendName: string;
  friendUid?: string;
}): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  const uid = getCurrentUserUid();
  if (!uid) {
    return;
  }

  const { addDoc, collection } = require('firebase/firestore');

  await addDoc(collection(db, 'users', uid, 'challengeInvitesSent'), {
    challengeId: input.challengeId,
    challengeName: input.challengeName,
    toUid: input.friendUid ?? null,
    toTag: input.friendTag,
    toName: input.friendName,
    status: 'sent',
    createdAt: Date.now(),
  });
}
