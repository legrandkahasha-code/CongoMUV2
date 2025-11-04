import { useEffect, useState, lazy, Suspense } from 'react';
import App from './App';
import { useAuth } from './lib/authContext';

// Lazy loading des composants de connexion
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Signup = lazy(() => import('./pages/Signup'));

// Composants des tableaux de bord
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OperatorDashboard = lazy(() => import('./pages/OperatorDashboard').then(m => ({ default: m.OperatorDashboard })));
const PassengerApp = lazy(() => import('./pages/PassengerApp').then(m => ({ default: m.PassengerApp })));
const AdminHQ = lazy(() => import('./pages/AdminHQ').then(module => ({ default: module.AdminHQ })));

// Composant de chargement
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function Root() {
  const [hash, setHash] = useState(window.location.hash || '');
  const [isReady, setIsReady] = useState(false);
  const { session, profile, loading } = useAuth();

  // Gestion du changement de hash
  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initialisation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirection après connexion
  useEffect(() => {
    if (!isReady || loading || !session) return;
    
    const userRoleRaw = (profile?.role || 'passenger').toLowerCase().replace('-', '_');
    const userRole = userRoleRaw === 'super_admin' ? 'superadmin' : userRoleRaw;
    console.log('Redirection après connexion - Hash actuel:', hash);
    console.log('Rôle de l\'utilisateur:', userRole);
    
    try {
      // Liste des rôles et leurs chemins correspondants
      const rolePaths = {
        superadmin: 'superadmin',
        admin: 'admin',
        operator: 'operator',
        passenger: 'passenger'
      };

      // Vérifier si l'utilisateur est déjà sur une page autorisée pour son rôle
      const isOnAuthorizedPage = Object.values(rolePaths).some(
        path => hash && hash.startsWith(`#/${path}`)
      );

      // Si l'utilisateur n'est pas sur une page autorisée, le rediriger
      if (!isOnAuthorizedPage) {
        const targetPath = `#/${userRole}`;
        console.log('Redirection vers:', targetPath);
        window.location.hash = targetPath;
      }
    } catch (error) {
      console.error('Erreur lors de la redirection:', error);
      // En cas d'erreur, rediriger vers la page par défaut du rôle
      window.location.hash = `#/${userRole}`;
    }
  }, [session, loading, hash, isReady, profile]);

  if (!isReady) {
    return <LoadingSpinner />;
  }

  // Routes de connexion et d'inscription
  if (hash.startsWith('#/login')) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage />
      </Suspense>
    );
  }

  if (hash.startsWith('#/signup')) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Signup />
      </Suspense>
    );
  }

  // Routes protégées
  if (hash.startsWith('#/admin') || 
      hash.startsWith('#/operator') || 
      hash.startsWith('#/passenger') ||
      hash.startsWith('#/superadmin')) {
    // Tant que l'auth charge, ne pas rediriger
    if (loading) return <LoadingSpinner />;
    // Redirection vers l'accueil seulement si on a fini de charger ET qu'il n'y a pas de session
    if (!session) {
      window.location.hash = '/';
      return <LoadingSpinner />;
    }

    const userRole = profile?.role || 'passenger';
    const userRoleNorm = (userRole as string).toLowerCase().replace('-', '_') === 'super_admin' 
      ? 'superadmin' 
      : (userRole as string).toLowerCase().replace('-', '_');
    
    // Redirection si l'utilisateur n'a pas le bon rôle
    if ((hash.startsWith('#/superadmin') && userRoleNorm !== 'superadmin') ||
        (hash.startsWith('#/admin') && userRoleNorm !== 'admin' && userRoleNorm !== 'superadmin') ||
        (hash.startsWith('#/operator') && userRoleNorm !== 'operator')) {
      window.location.hash = `#/${userRoleNorm}`;
      return <LoadingSpinner />;
    }

    // Afficher l'interface appropriée
    if (hash.startsWith('#/superadmin')) {
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminHQ />
        </Suspense>
      );
    }
    
    if (hash.startsWith('#/admin')) {
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminDashboard />
        </Suspense>
      );
    }
    
    if (hash.startsWith('#/operator')) {
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <OperatorDashboard />
        </Suspense>
      );
    }
    
    if (hash.startsWith('#/passenger')) {
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <PassengerApp />
        </Suspense>
      );
    }
  }

  // Par défaut, afficher la page d'accueil
  return <App />;
}
