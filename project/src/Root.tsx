import { useEffect, useRef, useState } from 'react';
import App from './App';
import LoginPage from './pages/LoginPage';
import Signup from './pages/Signup.tsx';
import AdminDashboard from './pages/AdminDashboard';
import { AdminHQ } from './pages/AdminHQ';
import { PassengerApp } from './pages/PassengerApp';
import { OperatorDashboard } from './pages/OperatorDashboard';
import { useAuth } from './lib/authContext';
import LoadingScreen from './components/LoadingScreen';

export default function Root() {
  const { session, loading, profile, signOut, refreshProfile } = useAuth();
  const [hash, setHash] = useState<string>(window.location.hash || '');
  const role = (profile?.role || '').toLowerCase();
  const [idleWarnVisible, setIdleWarnVisible] = useState(false);
  const [idleSecondsLeft, setIdleSecondsLeft] = useState(15);
  const timerRef = useRef<number | null>(null);
  const warnTimerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success'|'error'|'info'; title: string; desc?: string }>>([]);

  // 0) Always start clean: clear any persisted auth on first load (one-time guard)
  useEffect(() => {
    const w = window as unknown as { __didInitialAuthReset?: boolean };
    if (w.__didInitialAuthReset) return;
    w.__didInitialAuthReset = true;
    try {
      localStorage.removeItem('app_jwt');
      localStorage.removeItem('app_role');
      if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
    } catch {}
    (async () => {
      try {
        const { supabase } = await import('./lib/supabase');
        await supabase.auth.signOut();
      } catch {}
    })();
  }, []);

  // Fonction utilitaire pour normaliser les rôles
  const normalizeRole = (r: string | undefined): string => {
    if (!r) return '';
    return r.toLowerCase().trim();
  };

  // Vérifier si un rôle est admin
  const isAdminRole = (r: string | undefined): boolean => {
    const role = normalizeRole(r);
    return ['congomuv_hq', 'onatra', 'transco', 'private', 'admin', 'superadmin', 'super_admin'].includes(role);
  };

  // Vérifier si un rôle est superadmin
  const isSuperAdmin = (r: string | undefined): boolean => {
    const role = normalizeRole(r);
    return role === 'superadmin' || role === 'super_admin';
  };

  // Déterminer la cible de redirection en fonction du rôle (sans logs répétitifs)
  const getTargetForRole = (r: string | undefined): string => {
  const role = normalizeRole(r);
  if (isSuperAdmin(role)) return '#/superadmin';
  if (isAdminRole(role)) return '#/admin';
  if (role === 'operator') return '#/operator';
  if (role === 'passenger') return '#/passenger';
  return '#';
  };

  useEffect(() => {
    const onHash = async () => {
      setHash(window.location.hash || '');
      try {
        if (session && document.visibilityState === 'visible') {
          await refreshProfile();
        }
      } catch {}
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [session, refreshProfile]);

  // Exposer une fonction de déconnexion globale pour les boutons/menu hors du contexte React
  useEffect(() => {
    (window as unknown as { __signOut?: () => void }).__signOut = async () => {
      try { await signOut(); } finally { window.location.hash = '#/'; }
    };
    return () => { delete (window as unknown as { __signOut?: () => void }).__signOut; };
  }, [signOut]);

  // Idle timeout: 2 minutes of inactivity -> logout and redirect to login (with 15s warning)
  useEffect(() => {
    const IDLE_MS = 2 * 60 * 1000; // 2 minutes
    const WARN_MS = 15 * 1000; // 15 seconds warning

    const clearAuth = () => {
      try {
        localStorage.removeItem('app_jwt');
        localStorage.removeItem('app_role');
      } catch (err) {
        console.error('Error clearing auth:', err);
      }
    };

    const triggerLogout = () => {
      clearAuth();
      window.location.hash = '#/';
      window.location.reload();
    };

    const schedule = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (warnTimerRef.current) window.clearTimeout(warnTimerRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
      setIdleWarnVisible(false);
      setIdleSecondsLeft(15);
      // Warning before expiration
      warnTimerRef.current = window.setTimeout(() => {
        const hasToken = !!localStorage.getItem('app_jwt');
        if (!hasToken) return;
        setIdleWarnVisible(true);
        setIdleSecondsLeft(15);
        countdownRef.current = window.setInterval(() => {
          setIdleSecondsLeft(prev => {
            const next = prev - 1;
            if (next <= 0) {
              if (countdownRef.current) window.clearInterval(countdownRef.current);
              triggerLogout();
              return 0;
            }
            return next;
          });
        }, 1000);
      }, IDLE_MS - WARN_MS);

      // Fail-safe auto logout
      timerRef.current = window.setTimeout(() => {
        const hasToken = !!localStorage.getItem('app_jwt');
        if (hasToken) triggerLogout();
      }, IDLE_MS + 1000);
    };

    const resetIdle = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (warnTimerRef.current) window.clearTimeout(warnTimerRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
      setIdleWarnVisible(false);
      setIdleSecondsLeft(15);
      schedule();
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll', 'visibilitychange'];
    activityEvents.forEach(evt => window.addEventListener(evt, resetIdle, { passive: true } as AddEventListenerOptions));
    schedule();

    // Expose reset to window for modal button scope
    (window as { __resetIdle?: () => void }).__resetIdle = resetIdle;

    // Global notification/toast system
    (window as { addNotification?: (type: 'success'|'error'|'info', title: string, desc?: string) => void }).addNotification = (type: 'success'|'error'|'info', title: string, desc?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts(prev => [...prev, { id, type, title, desc }]);
      window.setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (warnTimerRef.current) window.clearTimeout(warnTimerRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
      activityEvents.forEach(evt => window.removeEventListener(evt, resetIdle as EventListenerOrEventListenerObject));
      delete (window as { __resetIdle?: () => void }).__resetIdle;
      delete (window as { addNotification?: (type: 'success'|'error'|'info', title: string, desc?: string) => void }).addNotification;
    };
  }, []);

  // Afficher l'écran de chargement professionnel pendant le chargement initial
  if (loading) {
    return <LoadingScreen />;
  }
  // Si une session existe mais que le profil/role n'est pas encore chargé, éviter toute redirection/gating
  if (session && (!profile || !profile.role)) {
    return <LoadingScreen />;
  }
  
  // 1) If user is on home but still authenticated (race condition), sign out silently and keep home visible
  if ((hash === '#/' || hash === '' || hash === '#') && session) {
    (async () => {
      try {
        const { supabase } = await import('./lib/supabase');
        await supabase.auth.signOut();
      } catch {}
    })();
  }

  // Si l'utilisateur est connecté et essaie d'accéder à une page d'authentification,
  // le rediriger vers son espace de travail. Ne pas rediriger depuis la page d'accueil (#/).
  if (session && role) {
    const authPages = ['#/login', '#/signup', '#/register', '#/forgot-password'];
    if (authPages.includes(hash) || authPages.some(page => hash.startsWith(page))) {
      const targetForRole = getTargetForRole(role);
      if (hash !== targetForRole) {
        window.location.hash = targetForRole;
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        );
      }
    }
  } else if (!session) {
    // Si l'utilisateur n'est pas connecté mais essaie d'accéder à une page protégée
    const protectedPaths = ['#/admin', '#/dashboard', '#/profile', '#/operator', '#/passenger', '#/driver', '#/superadmin'];
    if (protectedPaths.some(path => hash.startsWith(path))) {
      window.location.hash = '/';
      return null;
    }
  }

  // Prevent access to login when already authenticated -> send to role target
  if (hash.startsWith('#/login') && session && role) {
    const targetForRole = getTargetForRole(role);
    window.location.hash = targetForRole;
    return null;
  }

  // Routing
  if (hash.startsWith('#/login')) {
    return <LoginPage />;
  }

  if (hash.startsWith('#/signup')) {
    return <Signup />;
  }

  if (hash.startsWith('#/admin')) {
    if (!session) {
      location.hash = '#/';
      return null;
    }
    if (!role) return <LoadingScreen />;
    if (!isAdminRole(role) && !isSuperAdmin(role)) {
      location.hash = getTargetForRole(role);
      return null;
    }
    return <AdminDashboard />;
  }

  if (hash.startsWith('#/passenger')) {
    if (!session) { location.hash = '#/'; return null; }
    if (!role) return <LoadingScreen />;
    if (normalizeRole(role) !== 'passenger') { location.hash = getTargetForRole(role); return null; }
    return <PassengerApp />;
  }

  if (hash.startsWith('#/operator')) {
    if (!session) {
      location.hash = '#/';
      return null;
    }
    if (!role) return <LoadingScreen />;
    if (normalizeRole(role) !== 'operator') { location.hash = getTargetForRole(role); return null; }
    return <OperatorDashboard />;
  }

  if (hash.startsWith('#/superadmin')) {
    if (!session) {
      location.hash = '#/';
      return null;
    }
    if (!role) return <LoadingScreen />;
    if (!isSuperAdmin(role)) { location.hash = getTargetForRole(role); return null; }
    return <AdminHQ />;
  }

  // Default route: allow anonymous users to view landing (#/)

  // Warning modal rendered outside? We return above. Keep modal portal at root level using a fragment.
  return (
    <>
      {/* Global Toaster */}
      <div className="fixed top-4 right-4 z-[10000] space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`rounded-xl shadow-lg px-4 py-3 border text-sm ${t.type==='success' ? 'bg-blue-50 border-blue-200 text-blue-800' : t.type==='error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
            <div className="font-semibold">{t.title}</div>
            {t.desc && <div className="text-xs mt-0.5">{t.desc}</div>}
          </div>
        ))}
      </div>
      {/* Global Logout Button (visible when connected) */}
      {session && (
        <div className="fixed top-4 right-4 z-[10000] mt-16">
          <button
            onClick={() => (window as unknown as { __signOut?: () => void }).__signOut?.()}
            className="bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg text-sm"
            title="Se déconnecter"
          >
            Se déconnecter
          </button>
        </div>
      )}
      {idleWarnVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2">Inactivité détectée</h2>
            <p className="text-gray-600 mb-4">Vous serez déconnecté dans {idleSecondsLeft} secondes pour cause d'inactivité.</p>
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                const win = window as Window & { __resetIdle?: () => void };
                if (win.__resetIdle) win.__resetIdle();
              }}
            >
              Rester connecté
            </button>
          </div>
        </div>
      )}
      <App />
    </>
  );
}
