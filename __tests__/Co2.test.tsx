/**
 * Unit Tests - CO2 / Points Calculation Logic
 * Guião Sprint 1 - Testing (1%)
 * Testa a lógica de cálculo que converte km em pontos e CO2 poupado.
 */

// Espelha a lógica de POINTS_PER_KM e calculatePoints de LogTripScreen.tsx
const POINTS_PER_KM: Record<string, number> = {
    'Bicycle': 20,
    'Car': 5,
    'Walking': 15,
    'Train': 10,
    'Bus': 12,
    'Metro': 10,
    'Electric Scooter': 18,
};


const CAR_CO2_KG_PER_KM = 0.21;

function calculatePoints(mode: string, distanceKm: number): number {
    const rate = POINTS_PER_KM[mode];
    if (!rate || distanceKm <= 0) return 0;
    return Math.round(distanceKm * rate);
}

function calculateCO2Saved(mode: string, distanceKm: number): number {
    if (mode === 'Car' || distanceKm <= 0) return 0;
    return Math.round(distanceKm * CAR_CO2_KG_PER_KM * 1000) / 1000; // kg, 3 casas decimais
}

describe('calculatePoints - Unit Tests', () => {
    it('Bicycle at 10 km earns 200 points', () => {
        expect(calculatePoints('Bicycle', 10)).toBe(200);
    });

    it('Walking at 5 km earns 75 points', () => {
        expect(calculatePoints('Walking', 5)).toBe(75);
    });

    it('Car at 10 km earns 50 points', () => {
        expect(calculatePoints('Car', 10)).toBe(50);
    });

    it('Electric Scooter at 3 km earns 54 points', () => {
        expect(calculatePoints('Electric Scooter', 3)).toBe(54);
    });

    it('returns 0 for distance of 0', () => {
        expect(calculatePoints('Bicycle', 0)).toBe(0);
    });

    it('returns 0 for negative distance', () => {
        expect(calculatePoints('Bicycle', -5)).toBe(0);
    });

    it('returns 0 for unknown transport mode', () => {
        expect(calculatePoints('Helicopter', 10)).toBe(0);
    });

    it('rounds fractional points correctly', () => {
        // 20 points/km * 0.3 km = 6 points (exact)
        expect(calculatePoints('Bicycle', 0.3)).toBe(6);
    });
});

// ---------------------------------------------------------------------------
// Testes de CO2 Poupado
// ---------------------------------------------------------------------------

describe('calculateCO2Saved - Unit Tests', () => {
    it('Bicycle at 10 km saves 2.1 kg CO2', () => {
        expect(calculateCO2Saved('Bicycle', 10)).toBe(2.1);
    });

    it('Walking at 5 km saves 1.05 kg CO2', () => {
        expect(calculateCO2Saved('Walking', 5)).toBe(1.05);
    });

    it('Car saves 0 kg CO2 (baseline mode)', () => {
        expect(calculateCO2Saved('Car', 10)).toBe(0);
    });

    it('saves 0 CO2 for distance of 0', () => {
        expect(calculateCO2Saved('Bicycle', 0)).toBe(0);
    });

    it('saves 0 CO2 for negative distance', () => {
        expect(calculateCO2Saved('Train', -3)).toBe(0);
    });

    it('Bus at 20 km saves 4.2 kg CO2', () => {
        expect(calculateCO2Saved('Bus', 20)).toBe(4.2);
    });
});