/**
 * Test pour les fonctions utilitaires de chaînes de caractères
 */

describe('stringUtils', () => {
  describe('toTitleCase', () => {
    it('devrait convertir une chaîne en titre', () => {
      // Arrange
      const input = 'bonjour le monde';
      const expected = 'Bonjour Le Monde';
      
      // Act
      const result = toTitleCase(input);
      
      // Assert
      expect(result).toBe(expected);
    });

    it('devrait gérer une chaîne vide', () => {
      expect(toTitleCase('')).toBe('');
    });
  });
});

// Fonction utilitaire simple pour le test
function toTitleCase(str: string): string {
  if (!str) return '';
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
