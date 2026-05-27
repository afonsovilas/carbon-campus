import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('@/services/firebase', () => {
  let configured = true;
  return {
    db: {},
    get isFirebaseConfigured() { return configured; },
    __setConfigured: (val: boolean) => { configured = val; }
  };
});

jest.mock('@/services/auth.service', () => ({
  getCurrentUserUid: jest.fn().mockReturnValue('test-uid'),
}));

const mockAddDoc = jest.fn().mockResolvedValue({ id: 'new-challenge-id' } as never);
const mockGetDocs = jest.fn();

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  addDoc: (...args: any[]) => mockAddDoc(...args),
  getDocs: (...args: any[]) => mockGetDocs(...args),
}));

import {
  createChallengeInCloud,
  fetchChallengesFromCloud,
  sendChallengeInviteToCloud
} from '@/services/challenges.service';

describe('challenges.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a challenge in cloud', async () => {
    const challenge = await createChallengeInCloud({
      name: 'Test Challenge',
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    });
    
    expect(mockAddDoc).toHaveBeenCalled();
    expect(challenge?.id).toBe('new-challenge-id');
    expect(challenge?.name).toBe('Test Challenge');
  });

  it('returns early if no uid or not configured', async () => {
    const authService = require('@/services/auth.service');
    const { __setConfigured } = require('@/services/firebase');
    
    // No uid
    authService.getCurrentUserUid.mockReturnValueOnce(null);
    expect(await fetchChallengesFromCloud()).toEqual([]);

    authService.getCurrentUserUid.mockReturnValueOnce(null);
    expect(await createChallengeInCloud({} as any)).toBeNull();

    // Not configured
    __setConfigured(false);
    expect(await fetchChallengesFromCloud()).toEqual([]);
    expect(await createChallengeInCloud({} as any)).toBeNull();
    await sendChallengeInviteToCloud({} as any); // Should return immediately
    
    __setConfigured(true);
  });

  it('fetches challenges from cloud', async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ name: 'Fetched Challenge', startDate: '2026-01-01', endDate: '2026-01-31' }) }
      ]
    } as never);
    const challenges = await fetchChallengesFromCloud();
    expect(challenges).toHaveLength(1);
    expect(challenges[0].name).toBe('Fetched Challenge');
  });

  it('sends challenge invite to cloud', async () => {
    await sendChallengeInviteToCloud({
      challengeId: '1',
      challengeName: 'Test',
      friendTag: '@friend',
      friendName: 'Friend',
    });
    expect(mockAddDoc).toHaveBeenCalled();
  });
});
