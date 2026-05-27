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

jest.mock('@/services/users.service', () => ({
  fetchUserProfileFromCloud: jest.fn().mockResolvedValue({
    name: 'Test',
    tag: '@test',
    course: 'LEIC',
  } as never),
}));

const mockAddDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockIncrement = jest.fn((val) => val);

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  increment: mockIncrement,
  addDoc: mockAddDoc,
  setDoc: mockSetDoc,
  getDocs: mockGetDocs,
}));

import {
  saveTripToCloud,
  fetchTripsFromCloud,
  redeemPointsInCloud,
  fetchTripsFromCloudForUser
} from '@/services/trips.service';

describe('trips.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves trip to cloud', async () => {
    await saveTripToCloud({
      id: '1',
      mode: 'Bicycle',
      distance: 10,
      points: 50,
      date: '01/01',
    });
    
    expect(mockAddDoc).toHaveBeenCalled();
    // Two setDoc calls: one for user points, one for leaderboard
    expect(mockSetDoc).toHaveBeenCalledTimes(2);
  });

  it('fetches trips from cloud', async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: 'trip-1', data: () => ({ mode: 'Bus', distance: 5, points: 10, date: '01/01' }) }
      ]
    } as never);
    const trips = await fetchTripsFromCloud();
    expect(trips).toHaveLength(1);
    expect(trips[0].mode).toBe('Bus');
  });

  it('redeems points in cloud', async () => {
    await redeemPointsInCloud(50);
    expect(mockSetDoc).toHaveBeenCalledTimes(2); // user and leaderboard
    expect(mockAddDoc).toHaveBeenCalled(); // redemption history
  });

  it('fetches trips from cloud for user', async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: 'trip-2', data: () => ({ mode: 'Metro', distance: 8, points: 15, date: '01/02' }) }
      ]
    } as never);
    const trips = await fetchTripsFromCloudForUser('other-uid');
    expect(trips).toHaveLength(1);
    expect(trips[0].mode).toBe('Metro');
  });

  it('returns early if no uid is present', async () => {
    const authService = require('@/services/auth.service');
    authService.getCurrentUserUid.mockReturnValueOnce(null);

    await saveTripToCloud({} as any);
    expect(mockAddDoc).not.toHaveBeenCalled();

    authService.getCurrentUserUid.mockReturnValueOnce(null);
    expect(await fetchTripsFromCloud()).toEqual([]);

    authService.getCurrentUserUid.mockReturnValueOnce(null);
    await redeemPointsInCloud(50);
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('returns early if firebase is not configured', async () => {
    const { __setConfigured } = require('@/services/firebase');
    __setConfigured(false);

    await saveTripToCloud({} as any);
    expect(mockAddDoc).not.toHaveBeenCalled();

    expect(await fetchTripsFromCloud()).toEqual([]);
    
    await redeemPointsInCloud(50);
    expect(mockAddDoc).not.toHaveBeenCalled();

    expect(await fetchTripsFromCloudForUser('uid')).toEqual([]);

    __setConfigured(true);
  });
});
