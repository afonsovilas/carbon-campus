import { describe, expect, it, jest } from '@jest/globals';
import { emitLeaderboardRefresh, onLeaderboardRefresh } from '@/services/leaderboard-events';

describe('leaderboard-events', () => {
  it('adds, emits, and removes listeners', () => {
    const listener = jest.fn();
    const unsubscribe = onLeaderboardRefresh(listener);

    emitLeaderboardRefresh('trip-added');
    expect(listener).toHaveBeenCalledWith('trip-added');

    unsubscribe();
    emitLeaderboardRefresh('profile-updated');
    expect(listener).toHaveBeenCalledTimes(1); // Not called again
  });

  it('handles listener errors without throwing', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const faultyListener = () => { throw new Error('Test error'); };
    
    const unsubscribe = onLeaderboardRefresh(faultyListener);
    
    expect(() => emitLeaderboardRefresh('reward-redeemed')).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('Leaderboard refresh listener failed:', expect.any(Error));

    unsubscribe();
    consoleSpy.mockRestore();
  });
});
