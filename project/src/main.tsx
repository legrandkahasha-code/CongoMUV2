import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import Root from './Root.tsx';
import './styles/fonts.css'; // Ajout des polices optimisées
import './index.css';
import { AuthProvider } from './lib/authContext';
import { BookingProvider } from './context/BookingContext';
import './lib/sentry'; // Initialisation de Sentry

const root = createRoot(document.getElementById('root')!);

// Enveloppe l'application avec le ErrorBoundary de Sentry
const AppWithErrorBoundary = Sentry.withErrorBoundary(
  () => (
    <StrictMode>
      <AuthProvider>
        <BookingProvider>
          <Root />
        </BookingProvider>
      </AuthProvider>
    </StrictMode>
  ),
  {
    fallback: ({ error, resetError }) => (
      <div>
        <h2>Une erreur est survenue</h2>
        <p>{error instanceof Error ? error.message : String(error)}</p>
        <button onClick={resetError}>Réessayer</button>
      </div>
    ),
    onError: (error) => {
      console.error('Erreur non gérée:', error);
    },
  }
);

root.render(<AppWithErrorBoundary />);
