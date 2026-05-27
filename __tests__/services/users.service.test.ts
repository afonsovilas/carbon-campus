import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('@/services/firebase', () => {
  let configured = true;
  return {
    db: {},
    get isFirebaseConfigured() { return configured; },
    __setConfigured: (val: boolean) => { configured = val; }
  };
});

const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockGetDocs = jest.fn();

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  limit: jest.fn(),
  getDoc: (...args: any[]) => mockGetDoc(...args),
  setDoc: (...args: any[]) => mockSetDoc(...args),
  getDocs: (...args: any[]) => mockGetDocs(...args),
}));

import {
  syncPublicLeaderboardEntry,
  upsertUserProfile,
  updateUserProfile,
  ensureUserProfile,
  fetchUserProfileFromCloud,
  fetchAllUserProfilesFromCloud,
  fetchPublicLeaderboardEntriesFromCloud,
  findUserByTagFromCloud
} from '@/services/users.service';

describe('users.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('syncs public leaderboard entry', async () => {
    await syncPublicLeaderboardEntry('uid-1', { points: 100 });
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('upserts user profile when not existing', async () => {
    mockGetDoc.mockResolvedValueOnce({ exists: () => false } as never);
    const profile = await upsertUserProfile('uid-1', 'test@fe.up.pt');
    expect(mockSetDoc).toHaveBeenCalled();
    expect(profile.email).toBe('test@fe.up.pt');
  });

  it('upserts user profile when existing', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ email: 'test@fe.up.pt', name: 'Existing' }),
    } as never);
    const profile = await upsertUserProfile('uid-1', { name: 'New Name' });
    expect(mockSetDoc).toHaveBeenCalled();
    expect(profile.name).toBe('New Name');
  });

  it('catches and warns if syncPublicLeaderboardEntry fails during upsert', async () => {
    mockGetDoc.mockResolvedValueOnce({ exists: () => false } as never);
    mockSetDoc.mockImplementationOnce(() => Promise.resolve()); // upsert
    mockSetDoc.mockImplementationOnce(() => Promise.reject(new Error('sync fail'))); // sync

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await upsertUserProfile('uid-1', 'test@fe.up.pt');
    
    // Wait for the floating promise to resolve
    await new Promise(process.nextTick);

    expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to sync leaderboard entry:', expect.any(Error));
    consoleWarnSpy.mockRestore();
  });

  it('updates user profile', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ email: 'test@fe.up.pt', name: 'Updated' }),
    } as never);
    const profile = await updateUserProfile('uid-1', { name: 'Updated' });
    expect(mockSetDoc).toHaveBeenCalled();
    expect(profile?.name).toBe('Updated');
  });

  it('ensures user profile fetches if exists', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ email: 'test@fe.up.pt' }),
    } as never);
    const profile = await ensureUserProfile('uid-1', 'test@fe.up.pt');
    expect(profile.email).toBe('test@fe.up.pt');
  });

  it('ensures user profile upserts if not exists', async () => {
    mockGetDoc.mockResolvedValueOnce({ exists: () => false } as never); // fetchUserProfileFromCloud
    mockGetDoc.mockResolvedValueOnce({ exists: () => false } as never); // upsertUserProfile checks again
    const profile = await ensureUserProfile('uid-1', 'test@fe.up.pt');
    expect(profile.email).toBe('test@fe.up.pt');
  });

  it('fetches all user profiles', async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ email: 'test1@fe.up.pt' }) },
        { id: '2', data: () => ({ email: 'test2@fe.up.pt' }) }
      ]
    } as never);
    const profiles = await fetchAllUserProfilesFromCloud();
    expect(profiles).toHaveLength(2);
  });

  it('fetches public leaderboard entries', async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ name: 'Test1', points: 10 }) }
      ]
    } as never);
    const entries = await fetchPublicLeaderboardEntriesFromCloud();
    expect(entries).toHaveLength(1);
    expect(entries[0].points).toBe(10);
  });

  it('finds user by tag', async () => {
    mockGetDocs.mockResolvedValueOnce({
      empty: false,
      docs: [
        { id: 'uid-2', data: () => ({ tag: '@custom' }) }
      ]
    } as never);
    const user = await findUserByTagFromCloud('custom');
    expect(user?.uid).toBe('uid-2');
  });

  it('returns null if tag not found', async () => {
    mockGetDocs.mockResolvedValueOnce({ empty: true } as never);
    const user = await findUserByTagFromCloud('custom');
    expect(user).toBeNull();
  });

  it('returns early if not configured', async () => {
    const { __setConfigured } = require('@/services/firebase');
    __setConfigured(false);

    expect(await fetchUserProfileFromCloud('uid')).toBeNull();
    expect(await fetchAllUserProfilesFromCloud()).toEqual([]);
    expect(await fetchPublicLeaderboardEntriesFromCloud()).toEqual([]);
    expect(await findUserByTagFromCloud('query')).toBeNull();
    expect(await updateUserProfile('uid', {})).toBeNull();

    await syncPublicLeaderboardEntry('uid', {});
    
    const profile = await upsertUserProfile('uid', 'email');
    expect(profile.email).toBe('email');

    __setConfigured(true);
  });
});
