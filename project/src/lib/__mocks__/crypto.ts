// Mock pour le fichier crypto.ts

export async function encryptString(value: string) {
  // Simuler un chiffrement simple pour les tests
  return `encrypted:${btoa(value)}`;
}

export async function decryptString(encrypted: string) {
  // Simuler un déchiffrement simple pour les tests
  if (encrypted.startsWith('encrypted:')) {
    return atob(encrypted.substring(10));
  }
  return encrypted;
}
