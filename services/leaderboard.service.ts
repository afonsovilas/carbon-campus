import {
  DEFAULT_COURSE,
  fetchAllUserProfilesFromCloud,
  fetchPublicLeaderboardEntriesFromCloud,
} from '@/services/users.service';

export type StudentLeaderboardItem = {
  pos: number;
  uid: string;
  name: string;
  tag: string;
  course: string;
  points: number;
};

export type CourseLeaderboardItem = {
  pos: number;
  course: string;
  points: number;
  students: number;
};

export type LeaderboardPayload = {
  students: StudentLeaderboardItem[];
  courses: CourseLeaderboardItem[];
};

function sortByPointsThenName<T extends { points: number; name?: string; course?: string }>(items: T[]): T[] {
  return items.sort((left, right) => {
    if (right.points !== left.points) {
      return right.points - left.points;
    }

    const leftLabel = left.name || left.course || '';
    const rightLabel = right.name || right.course || '';
    return leftLabel.localeCompare(rightLabel);
  });
}

function applyPositions<T extends { pos: number }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    pos: index + 1,
  }));
}

export async function fetchLeaderboardFromCloud(): Promise<LeaderboardPayload> {
  const [profiles, leaderboardEntries] = await Promise.all([
    fetchAllUserProfilesFromCloud(),
    fetchPublicLeaderboardEntriesFromCloud(),
  ]);

  const pointsByUid = new Map(
    leaderboardEntries.map((entry) => [entry.uid, entry.points] as const)
  );

  // Use the aggregated leaderboard entries as the source of truth for points.
  // Profiles may have stale or missing `points` so prefer leaderboardEntries.
  const users = profiles.map((profile) => ({
    uid: profile.uid,
    name: profile.name,
    tag: profile.tag,
    course: profile.course || DEFAULT_COURSE,
    points: pointsByUid.get(profile.uid) ?? (profile as any).points ?? 0,
  }));

  if (users.length === 0) {
    return { students: [], courses: [] };
  }

  const students = applyPositions(sortByPointsThenName(users.map((user) => ({
    pos: 0,
    uid: user.uid,
    name: user.name,
    tag: user.tag,
    course: user.course || DEFAULT_COURSE,
    points: user.points,
  }))));

  const courseTotals = new Map<string, CourseLeaderboardItem>();

  for (const user of users) {
    const course = user.course || DEFAULT_COURSE;
    // Skip the default placeholder course (e.g. 'Sem curso') — only count registered courses
    if (!course || course === DEFAULT_COURSE) {
      continue;
    }

    const current = courseTotals.get(course) || { pos: 0, course, points: 0, students: 0 };
    courseTotals.set(course, {
      ...current,
      points: current.points + user.points,
      students: current.students + 1,
    });
  }

  const courses = applyPositions(sortByPointsThenName(Array.from(courseTotals.values())));

  return { students, courses };
}
