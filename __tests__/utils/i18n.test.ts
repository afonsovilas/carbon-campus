import { describe, expect, it } from '@jest/globals';
import { translations } from '@/utils/i18n';

describe('i18n utils', () => {
  it('formats strings correctly in English', () => {
    expect(translations.en.trips_registered(1)).toBe('1 trip registered');
    expect(translations.en.trips_registered(2)).toBe('2 trips registered');
    
    expect(translations.en.invite_sent_msg('Challenge A', '@friend')).toBe('Invite to Challenge A sent to @friend');
    expect(translations.en.app_invite_sent('test@test.com')).toBe('App invite sent to test@test.com');
    expect(translations.en.challenge_invite_sent('test@test.com')).toBe('Challenge invite sent to test@test.com');
    expect(translations.en.offer_text(50)).toBe('Offer: Espresso Coffee (Cost: 50 pts)');
    expect(translations.en.distance_from_station(100)).toBe('You\'re 100m from the station.');
  });

  it('formats strings correctly in Portuguese', () => {
    expect(translations.pt.trips_registered(1)).toBe('1 viagem registada');
    expect(translations.pt.trips_registered(2)).toBe('2 viagens registadas');
    
    expect(translations.pt.invite_sent_msg('Challenge A', '@friend')).toBe('Convite para Challenge A enviado para @friend');
    expect(translations.pt.app_invite_sent('test@test.com')).toBe('Convite para a app enviado para test@test.com');
    expect(translations.pt.challenge_invite_sent('test@test.com')).toBe('Convite para desafio enviado para test@test.com');
    expect(translations.pt.offer_text(50)).toBe('Oferta: Café Expresso (Custo: 50 pts)');
    expect(translations.pt.distance_from_station(100)).toBe('Estás a 100m da estação.');
  });
});
