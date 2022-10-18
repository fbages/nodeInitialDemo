import { Jugador } from './jugador';

describe('Jugador', () => {
  it('should create an instance', () => {
    expect(new Jugador("nom",[1,2,3],[1,2,3])).toBeTruthy();
  });
});
