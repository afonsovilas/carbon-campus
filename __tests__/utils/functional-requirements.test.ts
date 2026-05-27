import {
  calculateTripPoints,
  canCreateChallenge,
  canSaveTrip,
  findMockUserByTag,
  isDistanceValid,
  parseDistance,
  validateLogin,
  validateRegister,
} from '@/utils/functional-requirements';

describe('Unit tests - functional requirements', () => {
  describe('LogTrip rules', () => {
    it('parses comma decimal values', () => {
      expect(parseDistance('3,5')).toBe(3.5);
    });

    it('validates only positive numeric distances', () => {
      expect(isDistanceValid('2')).toBe(true);
      expect(isDistanceValid('0')).toBe(false);
      expect(isDistanceValid('-4')).toBe(false);
      expect(isDistanceValid('abc')).toBe(false);
      expect(isDistanceValid('')).toBe(false);
    });

    it('allows save only with valid distance and selected transport', () => {
      expect(canSaveTrip('4.2', 'Bicycle')).toBe(true);
      expect(canSaveTrip('0', 'Bicycle')).toBe(false);
      expect(canSaveTrip('4.2', null)).toBe(false);
    });

    it('calculates trip points by transport mode', () => {
      expect(calculateTripPoints('Bicycle', 2)).toBe(40);
      expect(calculateTripPoints('Bus', 2.5)).toBe(30);
    });
  });

  describe('Register rules', () => {
    it('rejects missing fields', () => {
      expect(validateRegister('', 'pass', 'pass', 'LEI')).toEqual({ ok: false, reason: 'missing_fields' });
    });

    it('rejects password mismatch', () => {
      expect(validateRegister('user@fe.up.pt', 'pass1', 'pass2', 'LEI')).toEqual({
        ok: false,
        reason: 'password_mismatch',
      });
    });

    it('rejects duplicate emails', () => {
      expect(validateRegister('duplicado@teste.pt', 'pass', 'pass', 'LEI')).toEqual({
        ok: false,
        reason: 'duplicate_email',
      });
    });

    it('accepts valid registration data', () => {
      expect(validateRegister('up202012345@fe.up.pt', 'pass', 'pass', 'LEI')).toEqual({ ok: true });
    });
  });

  describe('Invites and Challenges shared rules', () => {
    it('finds known mock user by tag', () => {
      expect(findMockUserByTag('user1')).toEqual({ name: 'User1', tag: '@user1_carbon' });
      expect(findMockUserByTag('USER1')).toEqual({ name: 'User1', tag: '@user1_carbon' });
      expect(findMockUserByTag('unknown')).toBeNull();
    });

    it('validates challenge creation required fields', () => {
      expect(canCreateChallenge('Sprint', '01/05', '31/05')).toBe(true);
      expect(canCreateChallenge('', '01/05', '31/05')).toBe(false);
      expect(canCreateChallenge('Sprint', '', '31/05')).toBe(false);
      expect(canCreateChallenge('Sprint', '01/05', '')).toBe(false);
    });
  });

  describe('Login rules', () => {
    it('rejects empty credentials', () => {
      expect(validateLogin('', '')).toEqual({ ok: false, reason: 'missing_fields' });
    });

    it('accepts valid credentials', () => {
      expect(validateLogin('teste@up.pt', '1234')).toEqual({ ok: true });
    });

    it('rejects invalid credentials', () => {
      expect(validateLogin('user@up.pt', 'wrong')).toEqual({
        ok: false,
        reason: 'invalid_credentials',
      });
    });
  });
});
