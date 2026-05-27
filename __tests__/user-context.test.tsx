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
  updateUserProfile: jest.fn().mockResolvedValue(undefined),
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
});
