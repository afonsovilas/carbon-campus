import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

jest.unmock('@/contexts/UserContext');

jest.mock('@/services/auth.service', () => ({
  getCurrentUserUid: jest.fn(),
  getCurrentUserEmail: jest.fn(),
  onAuthStateChange: jest.fn(() => () => undefined),
}));

jest.mock('@/services/users.service', () => ({
  ensureUserProfile: jest.fn(),
  syncPublicLeaderboardEntry: jest.fn(),
  updateUserProfile: jest.fn().mockResolvedValue(undefined as never),
}));

jest.mock('@/services/leaderboard-events', () => ({
  emitLeaderboardRefresh: jest.fn(),
}));

const { UserProvider, useUser } = require('@/contexts/UserContext');
const authService = require('@/services/auth.service');
const usersService = require('@/services/users.service');
const leaderboardEvents = require('@/services/leaderboard-events');

function UserProbe() {
  const { user, updateUser } = useUser();
  return (
    <>
      <Text testID="name">{user.name}</Text>
      <TouchableOpacity testID="update" onPress={() => updateUser({ name: 'Novo' })} />
    </>
  );
}

describe('UserContext', () => {
  it('uses default user in test env', () => {
    authService.getCurrentUserUid.mockReturnValue(null);

    const { getByTestId } = render(
      <UserProvider>
        <UserProbe />
      </UserProvider>
    );

    expect(getByTestId('name').props.children).toBe('Utilizador');
  });

  it('updates user and persists profile when uid exists', async () => {
    authService.getCurrentUserUid.mockReturnValue('uid-1');

    const { getByTestId } = render(
      <UserProvider>
        <UserProbe />
      </UserProvider>
    );

    fireEvent.press(getByTestId('update'));

    await waitFor(() => {
      expect(usersService.updateUserProfile).toHaveBeenCalledWith('uid-1', { name: 'Novo' });
      expect(leaderboardEvents.emitLeaderboardRefresh).toHaveBeenCalledWith('profile-updated');
    });
  });

  it('syncs profile on auth state change outside test env', async () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, "NODE_ENV", { value: 'development' });

    authService.getCurrentUserUid.mockReturnValue('uid-auth');
    authService.getCurrentUserEmail.mockReturnValue('auth@test.com');
    
    usersService.ensureUserProfile.mockResolvedValue({
      name: 'Auth User',
      email: 'auth@test.com',
      tag: '@auth',
      bio: '',
      avatarEmoji: '😎',
      course: 'LEIC',
    });
    usersService.syncPublicLeaderboardEntry.mockResolvedValue(undefined as never);

    let authHandler: any = null;
    authService.onAuthStateChange.mockImplementation((handler: any) => {
      authHandler = handler;
      return jest.fn();
    });

    const { getByTestId } = render(
      <UserProvider>
        <UserProbe />
      </UserProvider>
    );

    // Initial render might trigger sync, wait for it
    await waitFor(() => {
      expect(getByTestId('name').props.children).toBe('Auth User');
    });

    expect(usersService.ensureUserProfile).toHaveBeenCalledWith('uid-auth', 'auth@test.com');
    expect(usersService.syncPublicLeaderboardEntry).toHaveBeenCalledWith('uid-auth', {
      name: 'Auth User',
      tag: '@auth',
      course: 'LEIC',
    });

    Object.defineProperty(process.env, "NODE_ENV", { value: originalEnv });
  });

  it('handles uid missing when updating user', async () => {
    authService.getCurrentUserUid.mockReturnValue(null);
    usersService.updateUserProfile.mockClear();

    const { getByTestId } = render(
      <UserProvider>
        <UserProbe />
      </UserProvider>
    );

    fireEvent.press(getByTestId('update'));
    // Should not call updateUserProfile
    await waitFor(() => {
      expect(usersService.updateUserProfile).not.toHaveBeenCalled();
    });
  });

  it('handles errors during syncProfile', async () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, "NODE_ENV", { value: 'development' });

    authService.getCurrentUserUid.mockReturnValue('uid-err');
    authService.getCurrentUserEmail.mockReturnValue('err@test.com');
    
    // ensureUserProfile throws
    usersService.ensureUserProfile.mockRejectedValue(new Error('sync error'));
    
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <UserProvider>
        <UserProbe />
      </UserProvider>
    );

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to sync user profile from Firebase:', expect.any(Error));
    });

    // ensureUserProfile succeeds but syncPublicLeaderboardEntry throws
    usersService.ensureUserProfile.mockResolvedValue({ name: 'Valid' });
    usersService.syncPublicLeaderboardEntry.mockRejectedValue(new Error('leaderboard err'));

    let authHandler: any = null;
    authService.onAuthStateChange.mockImplementation((handler: any) => {
      authHandler = handler;
      return jest.fn();
    });

    render(
      <UserProvider>
        <UserProbe />
      </UserProvider>
    );

    await waitFor(() => {
      if (authHandler) authHandler();
    });

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to sync leaderboard entry on login:', expect.any(Error));
    });

    consoleWarnSpy.mockRestore();
    Object.defineProperty(process.env, "NODE_ENV", { value: originalEnv });
  });

  it('throws error if useUser used outside provider', () => {
    const { useUser } = require('@/contexts/UserContext');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const Probe = () => { useUser(); return null; };
    expect(() => render(<Probe />)).toThrow('useUser must be used within a UserProvider');
    consoleErrorSpy.mockRestore();
  });
});
