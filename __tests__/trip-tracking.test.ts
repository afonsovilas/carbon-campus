import { describe, it, expect, beforeEach } from '@jest/globals';
import {
    calculateHaversineDistance,
    calculateTotalDistance,
    calculateCarbonSaved,
    calculatePointsFromCarbon,
    findNearestStop,
    isLocationOnRoute,
    validateTripData,
    isValidSpeed,
    TripLocation,
    GTFSStop,
    GTFSRoute,
    ActiveTrip,
} from '@/utils/trip-tracking';

describe('Trip Tracking Utils', () => {
    describe('calculateHaversineDistance', () => {
        it('deve calcular distância entre duas coordenadas', () => {
            const distance = calculateHaversineDistance(
                41.14858,
                -8.610945,
                41.16112,
                -8.604272
            );
            expect(distance).toBeGreaterThan(1);
            expect(distance).toBeLessThan(3);
        });

        it('deve retornar 0 para mesma coordenada', () => {
            expect(calculateHaversineDistance(41.14858, -8.610945, 41.14858, -8.610945)).toBe(0);
        });
    });

    describe('calculateTotalDistance', () => {
        it('deve calcular distância total de viagem', () => {
            const locations: TripLocation[] = [
                { latitude: 41.14858, longitude: -8.610945, timestamp: 0 },
                { latitude: 41.16112, longitude: -8.604272, timestamp: 1000 },
                { latitude: 41.19024, longitude: -8.661037, timestamp: 2000 },
            ];

            const distance = calculateTotalDistance(locations);
            expect(distance).toBeGreaterThan(6);
            expect(distance).toBeLessThan(8);
        });

        it('deve retornar 0 para localizações insuficientes', () => {
            const singleLocation: TripLocation[] = [
                { latitude: 41.14858, longitude: -8.610945, timestamp: 0 },
            ];

            expect(calculateTotalDistance(singleLocation)).toBe(0);
            expect(calculateTotalDistance([])).toBe(0);
        });
    });

    describe('calculateCarbonSaved', () => {
        it('deve calcular carbono economizado com autocarro', () => {
            const carbon = calculateCarbonSaved(10, 'Bus');
            expect(carbon).toBeCloseTo(1.83, 1);
        });

        it('deve calcular mais carbono com metro', () => {
            const carbon = calculateCarbonSaved(10, 'Metro');
            expect(carbon).toBeCloseTo(1.94, 1);
        });

        it('deve ser proporcional à distância', () => {
            const carbon1 = calculateCarbonSaved(5, 'Bus');
            const carbon2 = calculateCarbonSaved(10, 'Bus');
            expect(carbon2).toBeCloseTo(carbon1 * 2, 1);
        });

        it('deve retornar 0 carbono economizado para Carro', () => {
            const carbon = calculateCarbonSaved(10, 'Car');
            expect(carbon).toBe(0);
        });

        it('deve calcular mais carbono com Trotinete e Bicicleta', () => {
            const scooterCarbon = calculateCarbonSaved(10, 'Electric Scooter');
            const bikeCarbon = calculateCarbonSaved(10, 'Bicycle');
            
            // Car emission is 0.21, Scooter is 0.005 -> 0.205 per km
            expect(scooterCarbon).toBeCloseTo(2.05, 1);
            // Bicycle is 0 -> 0.21 per km
            expect(bikeCarbon).toBeCloseTo(2.10, 1);
        });
    });

    describe('calculatePointsFromCarbon', () => {
        it('deve calcular pontos corretamente', () => {
            const points = calculatePointsFromCarbon(1);
            expect(points).toBe(50);
        });

        it('deve arredondar para inteiro', () => {
            const points = calculatePointsFromCarbon(0.33);
            expect(Number.isInteger(points)).toBe(true);
            expect(points).toBe(17);
        });
    });

    describe('findNearestStop', () => {
        let stops: GTFSStop[];

        beforeEach(() => {
            stops = [
                {
                    stop_id: '5766',
                    stop_name: 'Aliados',
                    stop_lat: 41.14858,
                    stop_lon: -8.610945,
                    zone_id: 'PRT1',
                },
                {
                    stop_id: '5775',
                    stop_name: 'Marquês',
                    stop_lat: 41.16112,
                    stop_lon: -8.604272,
                    zone_id: 'PRT1',
                },
                {
                    stop_id: '5778',
                    stop_name: 'São Bento',
                    stop_lat: 41.14494,
                    stop_lon: -8.610815,
                    zone_id: 'PRT1',
                },
            ];
        });

        it('deve encontrar paragem mais próxima', () => {
            const location: TripLocation = {
                latitude: 41.14858,
                longitude: -8.610945,
                timestamp: 0,
            };

            const result = findNearestStop(location, stops);
            expect(result).not.toBeNull();
            expect(result?.stop.stop_id).toBe('5766');
            expect(result?.distance).toBeLessThan(0.1);
        });

        it('deve retornar null sem paragens', () => {
            const location: TripLocation = {
                latitude: 41.14858,
                longitude: -8.610945,
                timestamp: 0,
            };

            const result = findNearestStop(location, []);
            expect(result).toBeNull();
        });
    });

    describe('isLocationOnRoute', () => {
        let route: GTFSRoute;

        beforeEach(() => {
            route = {
                stops: [
                    {
                        stop_id: '5766',
                        stop_name: 'Aliados',
                        stop_lat: 41.14858,
                        stop_lon: -8.610945,
                        zone_id: 'PRT1',
                    },
                    {
                        stop_id: '5775',
                        stop_name: 'Marquês',
                        stop_lat: 41.16112,
                        stop_lon: -8.604272,
                        zone_id: 'PRT1',
                    },
                ],
                zone_id: 'PRT1',
            };
        });

        it('deve validar localização na rota', () => {
            const location: TripLocation = {
                latitude: 41.14858,
                longitude: -8.610945,
                timestamp: 0,
            };

            expect(isLocationOnRoute(location, route)).toBe(true);
        });

        it('deve rejeitar localização fora da rota', () => {
            const location: TripLocation = {
                latitude: 40.0,
                longitude: -8.0,
                timestamp: 0,
            };

            expect(isLocationOnRoute(location, route)).toBe(false);
        });
    });

    describe('validateTripData', () => {
        let route: GTFSRoute;

        beforeEach(() => {
            route = {
                stops: [
                    {
                        stop_id: '5766',
                        stop_name: 'Aliados',
                        stop_lat: 41.14858,
                        stop_lon: -8.610945,
                        zone_id: 'PRT1',
                    },
                    {
                        stop_id: '5775',
                        stop_name: 'Marquês',
                        stop_lat: 41.16112,
                        stop_lon: -8.604272,
                        zone_id: 'PRT1',
                    },
                    {
                        stop_id: '5726',
                        stop_name: 'Trindade',
                        stop_lat: 41.15228,
                        stop_lon: -8.609299,
                        zone_id: 'PRT1',
                    },
                ],
                zone_id: 'PRT1',
            };
        });

        it('deve rejeitar viagem com poucas localizações', () => {
            const trip: ActiveTrip = {
                id: 'test-1',
                startTime: Date.now(),
                transportMode: 'Bus',
                status: 'completed',
                locations: [
                    { latitude: 41.14858, longitude: -8.610945, timestamp: 0 },
                ],
            };

            const result = validateTripData(trip, route);
            expect(result.valid).toBe(false);
            expect(result.reason).toContain('Insuficientes');
        });

        it('deve aceitar viagem válida na rota', () => {
            const trip: ActiveTrip = {
                id: 'test-2',
                startTime: Date.now() - 600000,
                transportMode: 'Bus',
                status: 'completed',
                locations: [
                    { latitude: 41.14858, longitude: -8.610945, timestamp: Date.now() - 600000 },
                    { latitude: 41.15228, longitude: -8.609299, timestamp: Date.now() - 300000 },
                    { latitude: 41.16112, longitude: -8.604272, timestamp: Date.now() },
                ],
            };

            const result = validateTripData(trip, route);
            expect(result.valid).toBe(true);
        });

        it('deve rejeitar viagem com distância muito curta', () => {
            const trip: ActiveTrip = {
                id: 'test-3',
                startTime: Date.now(),
                transportMode: 'Bus',
                status: 'completed',
                locations: [
                    { latitude: 41.14858, longitude: -8.610945, timestamp: 0 },
                    { latitude: 41.14859, longitude: -8.610946, timestamp: 1000 },
                ],
            };

            const result = validateTripData(trip, route);
            expect(result.valid).toBe(false);
            expect(result.reason).toContain('muito curta');
        });
    });

    describe('isValidSpeed', () => {
        it('deve validar velocidade apropriada', () => {
            const loc1: TripLocation = {
                latitude: 41.14858,
                longitude: -8.610945,
                timestamp: 0,
            };
            const loc2: TripLocation = {
                latitude: 41.16112,
                longitude: -8.604272,
                timestamp: 60000,
            };

            expect(isValidSpeed(loc1, loc2)).toBe(true);
        });

        it('deve rejeitar velocidade muito alta', () => {
            const loc1: TripLocation = {
                latitude: 0,
                longitude: 0,
                timestamp: 0,
            };
            const loc2: TripLocation = {
                latitude: 1,
                longitude: 1,
                timestamp: 100,
            };

            expect(isValidSpeed(loc1, loc2)).toBe(false);
        });

        it('deve validar velocidade muito baixa aceitável', () => {
            const loc1: TripLocation = {
                latitude: 41.14858,
                longitude: -8.610945,
                timestamp: 0,
            };
            const loc2: TripLocation = {
                latitude: 41.15000,
                longitude: -8.610000,
                timestamp: 60000,
            };

            expect(isValidSpeed(loc1, loc2)).toBe(true);
        });

        it('deve retornar true para mesmo timestamp', () => {
            const loc1: TripLocation = {
                latitude: 41.14858,
                longitude: -8.610945,
                timestamp: 0,
            };
            const loc2: TripLocation = {
                latitude: 41.16112,
                longitude: -8.604272,
                timestamp: 0,
            };

            expect(isValidSpeed(loc1, loc2)).toBe(true);
        });
    });
});
