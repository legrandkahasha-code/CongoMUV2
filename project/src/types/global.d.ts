// Déclaration des types globaux
declare global {
  interface Window {
    signOut: () => Promise<boolean>;
  }
}

export {}; // Ceci est nécessaire pour que TypeScript traite ce fichier comme un module
