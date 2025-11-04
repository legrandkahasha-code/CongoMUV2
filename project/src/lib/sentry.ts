import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENV = import.meta.env.MODE;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENV,
    release: `congo-muv@${import.meta.env.VITE_APP_VERSION || '0.0.0'}`,
    // BrowserTracing est automatiquement inclus dans @sentry/react v10+
    tracesSampleRate: ENV === 'production' ? 0.2 : 1.0,
    beforeSend(event) {
      // Filtre les erreurs de rejet de promesse non attrapées
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === 'TypeError' && error?.value?.includes('Failed to fetch')) {
          return null; // Ignore les erreurs de réseau
        }
      }
      return event;
    },
  });
}

export default Sentry;
