export type TransportMode =
  | 'Bicycle'
  | 'Car'
  | 'Walking'
  | 'Train'
  | 'Bus'
  | 'Metro'
  | 'Electric Scooter';

export type RegisterValidation =
  | { ok: false; reason: 'missing_fields' }
  | { ok: false; reason: 'password_mismatch' }
  | { ok: false; reason: 'duplicate_email' }
  | { ok: true };

export type LoginValidation =
  | { ok: false; reason: 'missing_fields' }
  | { ok: false; reason: 'invalid_credentials' }
  | { ok: true };

export const POINTS_PER_KM: Record<TransportMode, number> = {
  Bicycle: 20,
  Car: 5,
  Walking: 15,
  Train: 10,
  Bus: 12,
  Metro: 10,
  'Electric Scooter': 18,
};

export function parseDistance(value: string): number {
  return Number(value.replace(',', '.'));
}

export function isDistanceValid(value: string): boolean {
  const parsed = parseDistance(value);
  return value.trim() !== '' && Number.isFinite(parsed) && parsed > 0;
}

export function canSaveTrip(value: string, selectedTransport: TransportMode | null): boolean {
  return isDistanceValid(value) && selectedTransport !== null;
}

export function calculateTripPoints(mode: TransportMode, distance: number): number {
  return Math.round(distance * POINTS_PER_KM[mode]);
}

export function validateRegister(
  email: string,
  password: string,
  confirmPassword: string
): RegisterValidation {
  if (!email || !password || !confirmPassword) {
    return { ok: false, reason: 'missing_fields' };
  }

  if (password !== confirmPassword) {
    return { ok: false, reason: 'password_mismatch' };
  }

  if (email === 'duplicado@teste.pt') {
    return { ok: false, reason: 'duplicate_email' };
  }

  return { ok: true };
}

export function findMockUserByTag(searchTag: string): { name: string; tag: string } | null {
  if (searchTag.toLowerCase() === 'user1') {
    return { name: 'User1', tag: '@user1_carbon' };
  }

  return null;
}

export function canCreateChallenge(name: string, startDate: string, endDate: string): boolean {
  return Boolean(name.trim() && startDate.trim() && endDate.trim());
}

export function validateLogin(email: string, password: string): LoginValidation {
  if (!email || !password) {
    return { ok: false, reason: 'missing_fields' };
  }

  if (email === 'teste@up.pt' && password === '1234') {
    return { ok: true };
  }

  return { ok: false, reason: 'invalid_credentials' };
}
