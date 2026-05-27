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

const mockAddDoc = jest.fn().mockResolvedValue(undefined as never);

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: (...args: any[]) => mockAddDoc(...args),
}));

import { sendFriendRequestToCloud } from '@/services/invites.service';

describe('invites.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends friend request to cloud', async () => {
    await sendFriendRequestToCloud({
      tag: '@test',
      name: 'Test User',
      uid: 'other-uid'
    });
    
    expect(mockAddDoc).toHaveBeenCalled();
  });

  it('returns early if no uid or not configured', async () => {
    const authService = require('@/services/auth.service');
    const { __setConfigured } = require('@/services/firebase');
    
    // No uid
    authService.getCurrentUserUid.mockReturnValueOnce(null);
    await sendFriendRequestToCloud({ tag: '@test', name: 'Test User' });
    expect(mockAddDoc).not.toHaveBeenCalled();

    // Not configured
    __setConfigured(false);
    await sendFriendRequestToCloud({ tag: '@test', name: 'Test User' });
    expect(mockAddDoc).not.toHaveBeenCalled();

    __setConfigured(true);
  });
});
