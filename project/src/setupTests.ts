import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configuration de testing-library
configure({
  testIdAttribute: 'data-test-id',
  // Désactive la détection des modifications de style pour les tests
  computedStyleSupportsPseudoElements: false,
});

// Mocks pour les tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as unknown as Storage;

// Mock pour window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Ignorer les avertissements de console pendant les tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Réinitialiser les mocks avant chaque test
  jest.clearAllMocks();
  
  // Sauvegarder les fonctions de console d'origine
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Ignorer les avertissements spécifiques aux tests
  console.error = (...args) => {
    // Vérifier si args[0] est une chaîne avant d'appeler includes
    const firstArg = args[0];
    if (typeof firstArg === 'string') {
      // Ignorer les avertissements spécifiques
      if (
        firstArg.includes('ReactDOM.render is no longer supported in React 18') ||
        firstArg.includes('A component is changing an uncontrolled input')
      ) {
        return;
      }
    }
    originalConsoleError(...args);
  };

  console.warn = (...args) => {
    // Vérifier si args[0] est une chaîne avant d'appeler includes
    const firstArg = args[0];
    if (typeof firstArg === 'string') {
      // Ignorer les avertissements spécifiques
      if (
        firstArg.includes('componentWillReceiveProps has been renamed') ||
        firstArg.includes('componentWillUpdate has been renamed') ||
        firstArg.includes('React does not recognize') ||
        firstArg.includes('A component is changing a controlled input')
      ) {
        return;
      }
    }
    originalConsoleWarn(...args);
  };
});

afterEach(() => {
  // Restaurer les fonctions de console d'origine
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
