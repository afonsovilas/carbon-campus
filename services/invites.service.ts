import { getCurrentUserUid } from '@/services/auth.service';
import { db, isFirebaseConfigured } from '@/services/firebase';

export async function sendFriendRequestToCloud(target: { uid?: string; tag: string; name: string }): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  const uid = getCurrentUserUid();
  if (!uid) {
    return;
  }

  const { addDoc, collection } = require('firebase/firestore');

  await addDoc(collection(db, 'users', uid, 'friendRequestsSent'), {
    toUid: target.uid ?? null,
    toTag: target.tag,
    toName: target.name,
    status: 'pending',
    createdAt: Date.now(),
  });
}
