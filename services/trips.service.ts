import { Trip } from '@/contexts/TripsContext';
import { getCurrentUserUid } from '@/services/auth.service';
import { db, isFirebaseConfigured } from '@/services/firebase';

type TripDocument = Trip & { createdAt: number };

export async function saveTripToCloud(trip: Trip): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  const uid = getCurrentUserUid();
  if (!uid) {
    return;
  }

  const { addDoc, collection } = require('firebase/firestore');
  const { getDoc, doc, setDoc, increment } = require('firebase/firestore');

  const payload: TripDocument = {
    ...trip,
    createdAt: Date.now(),
  };

  await addDoc(collection(db, 'users', uid, 'trips'), payload);

  await setDoc(doc(db, 'users', uid), {
    points: increment(trip.points),
    updatedAt: Date.now(),
  }, { merge: true });

  const leaderboardRef = doc(db, 'leaderboardEntries', uid);
  const leaderboardSnapshot = await getDoc(leaderboardRef);
  const currentPoints = leaderboardSnapshot.exists() ? Number(leaderboardSnapshot.data()?.points || 0) : 0;
  await setDoc(leaderboardRef, { uid, points: currentPoints + trip.points, updatedAt: Date.now() }, { merge: true });
}

export async function fetchTripsFromCloud(): Promise<Trip[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  const uid = getCurrentUserUid();
  if (!uid) {
    return [];
  }

  const { collection, getDocs, orderBy, query } = require('firebase/firestore');

  const tripsQuery = query(collection(db, 'users', uid, 'trips'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(tripsQuery);

  return snapshot.docs.map((doc: any) => {
    const data = doc.data() as TripDocument;
    return {
      id: data.id ?? doc.id,
      mode: data.mode,
      distance: data.distance,
      points: data.points,
      date: data.date,
    };
  });
}

export async function fetchTripsFromCloudForUser(uid: string): Promise<Trip[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  const { collection, getDocs, orderBy, query } = require('firebase/firestore');

  const tripsQuery = query(collection(db, 'users', uid, 'trips'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(tripsQuery);

  return snapshot.docs.map((doc: any) => {
    const data = doc.data() as TripDocument;
    return {
      id: data.id ?? doc.id,
      mode: data.mode,
      distance: data.distance,
      points: data.points,
      date: data.date,
    };
  });
}
