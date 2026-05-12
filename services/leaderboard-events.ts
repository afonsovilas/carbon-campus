export type LeaderboardRefreshReason = 'trip-added' | 'profile-updated';

type Listener = (reason: LeaderboardRefreshReason) => void;

const listeners = new Set<Listener>();

export function emitLeaderboardRefresh(reason: LeaderboardRefreshReason): void {
  listeners.forEach((listener) => {
    try {
      listener(reason);
    } catch (error) {
      console.warn('Leaderboard refresh listener failed:', error);
    }
  });
}

export function onLeaderboardRefresh(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
