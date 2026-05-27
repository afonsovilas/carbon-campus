import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('@/services/firebase', () => ({
  auth: {
    currentUser: { uid: 'test-uid', email: 'test@example.com' },
  },
  isFirebaseConfigured: true,
}));

const mockCreateUser = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockOnAuthStateChanged = jest.fn();

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: any[]) => mockCreateUser(...args),
  signInWithEmailAndPassword: (...args: any[]) => mockSignIn(...args),
  signOut: (...args: any[]) => mockSignOut(...args),
  onAuthStateChanged: (...args: any[]) => mockOnAuthStateChanged(...args),
}));

import {
  registerWithEmail,
  loginWithEmail,
  getCurrentUserUid,
  getCurrentUserEmail,
  signOutUser,
  onAuthStateChange
} from '@/services/auth.service';

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a user with email and password', async () => {
    mockCreateUser.mockResolvedValue({ user: { uid: 'new-uid' } });
    const result = await registerWithEmail('test@test.com', 'password');
    expect(mockCreateUser).toHaveBeenCalled();
    expect(result.uid).toBe('new-uid');
  });

  it('logs in a user with email and password', async () => {
    mockSignIn.mockResolvedValue({ user: { uid: 'logged-uid' } });
    const result = await loginWithEmail('test@test.com', 'password');
    expect(mockSignIn).toHaveBeenCalled();
    expect(result.uid).toBe('logged-uid');
  });

  it('gets current user uid', () => {
    expect(getCurrentUserUid()).toBe('test-uid');
  });

  it('gets current user email', () => {
    expect(getCurrentUserEmail()).toBe('test@example.com');
  });

  it('signs out user', async () => {
    mockSignOut.mockResolvedValue(undefined);
    await signOutUser();
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('listens to auth state changes', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development'; // so it doesn't return early in the test
    
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'change-uid' });
      return jest.fn();
    });

    const handler = jest.fn();
    onAuthStateChange(handler);
    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith('change-uid');

    process.env.NODE_ENV = originalEnv;
  });

  it('throws error when firebase is not configured in register', async () => {
    const firebaseMock = require('@/services/firebase');
    firebaseMock.isFirebaseConfigured = false;
    await expect(registerWithEmail('a', 'b')).rejects.toThrow('Firebase Auth is not configured');
    firebaseMock.isFirebaseConfigured = true;
  });

  it('throws error when firebase is not configured in login', async () => {
    const firebaseMock = require('@/services/firebase');
    firebaseMock.isFirebaseConfigured = false;
    await expect(loginWithEmail('a', 'b')).rejects.toThrow('Firebase Auth is not configured');
    firebaseMock.isFirebaseConfigured = true;
  });

  it('returns null when firebase is not configured for uid/email', () => {
    const firebaseMock = require('@/services/firebase');
    firebaseMock.isFirebaseConfigured = false;
    expect(getCurrentUserUid()).toBeNull();
    expect(getCurrentUserEmail()).toBeNull();
    firebaseMock.isFirebaseConfigured = true;
  });

  it('does nothing when signing out unconfigured', async () => {
    const firebaseMock = require('@/services/firebase');
    firebaseMock.isFirebaseConfigured = false;
    await signOutUser();
    firebaseMock.isFirebaseConfigured = true;
  });

  it('clears web session on web with indexedDB', async () => {
    mockSignOut.mockResolvedValue(undefined as never);
    const Platform = require('react-native').Platform;
    Platform.OS = 'web';
    
    // Mock window with indexedDB
    const mockDeleteDatabase = jest.fn();
    global.window = {
      localStorage: {
        length: 2,
        key: (i: number) => i === 0 ? 'firebase:token' : null,
        removeItem: jest.fn().mockImplementation((k: string) => {
          if (k === 'firebase:token') throw new Error('storage error');
        }),
      },
      sessionStorage: {
        length: 0,
        key: () => null,
        removeItem: jest.fn(),
      },
      indexedDB: {
        databases: jest.fn().mockResolvedValue([{ name: 'firebase-db' }, { name: 'other-db' }, { name: null }]),
        deleteDatabase: mockDeleteDatabase,
      }
    } as any;
    (global as any).indexedDB = global.window.indexedDB;

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await signOutUser();
    
    // Test that indexedDB is called after the promise resolves
    await new Promise(process.nextTick);

    expect(mockSignOut).toHaveBeenCalled();
    expect(global.window.localStorage.removeItem).toHaveBeenCalledWith('firebase:token');
    expect(consoleWarnSpy).toHaveBeenCalledWith('[firebase] Failed to clear auth storage key', 'firebase:token', expect.any(Error));
    expect(global.window.indexedDB.databases).toHaveBeenCalled();
    expect(mockDeleteDatabase).toHaveBeenCalledWith('firebase-db');
    
    consoleWarnSpy.mockRestore();
    Platform.OS = 'ios'; // reset
    delete (global as any).window;
    delete (global as any).indexedDB;
  });

  it('handles indexedDB failures', async () => {
    const Platform = require('react-native').Platform;
    Platform.OS = 'web';
    
    global.window = {
      localStorage: { length: 0, key: () => null },
      sessionStorage: { length: 0, key: () => null },
      indexedDB: {
        databases: jest.fn().mockRejectedValue(new Error('db error')),
      }
    } as any;
    (global as any).indexedDB = global.window.indexedDB;

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await signOutUser();
    await new Promise(process.nextTick);
    
    expect(consoleWarnSpy).toHaveBeenCalledWith('[firebase] Failed to inspect indexedDB databases', expect.any(Error));

    consoleWarnSpy.mockRestore();
    Platform.OS = 'ios';
    delete (global as any).window;
    delete (global as any).indexedDB;
  });

  it('handles deleteDatabase failures', async () => {
    const Platform = require('react-native').Platform;
    Platform.OS = 'web';
    
    global.window = {
      localStorage: { length: 0, key: () => null },
      sessionStorage: { length: 0, key: () => null },
      indexedDB: {
        databases: jest.fn().mockResolvedValue([{ name: 'firebase-db' }]),
        deleteDatabase: jest.fn().mockImplementation(() => { throw new Error('del err'); }),
      }
    } as any;
    (global as any).indexedDB = global.window.indexedDB;

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await signOutUser();
    await new Promise(process.nextTick);
    
    expect(consoleWarnSpy).toHaveBeenCalledWith('[firebase] Failed to delete indexedDB database', 'firebase-db', expect.any(Error));

    consoleWarnSpy.mockRestore();
    Platform.OS = 'ios';
    delete (global as any).window;
    delete (global as any).indexedDB;
  });

  it('returns early from clearFirebaseWebSession if window is undefined', async () => {
    const Platform = require('react-native').Platform;
    Platform.OS = 'web';
    delete (global as any).window; // ensure it's undefined
    
    await signOutUser(); // Should not crash
    
    Platform.OS = 'ios';
  });

  it('returns early from onAuthStateChange in test environment', () => {
    const handler = jest.fn();
    const unsub = onAuthStateChange(handler);
    expect(handler).toHaveBeenCalledWith(null);
    expect(unsub).toBeInstanceOf(Function);
  });
});
