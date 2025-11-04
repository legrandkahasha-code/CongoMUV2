import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';
import { supabase } from './supabase';

// Fonction pour nettoyer le stockage local
const cleanLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Nettoyer le localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.startsWith('supabase.') || key.startsWith('sb_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Nettoyer les cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name.startsWith('sb-') || name.startsWith('supabase-')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage du stockage:', error);
  }
};

type Organization = {
  id: string;
  name: string;
};

export type AppProfile = {
  id: string;
  role: string;
  name: string | null;
  phone: string | null;
  organizationId: string | null;
  organizationName: string | null;
};

type AuthContextType = {
  session: any;
  profile: AppProfile | null;
  loading: boolean;
  currentOrganization: Organization | null;
  selectOrganization: (id: string | null, name?: string) => Promise<void>;
  canAccessOrganization: (id: string | null) => boolean;
  hasRole: (requiredRole: string) => boolean;
  signUp: (args: { email: string; password: string; full_name?: string; phone?: string }) => Promise<{ error?: string }>;
  signInWithPassword: (args: { email: string; password: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const defaultContextValue: AuthContextType = {
  session: null,
  profile: null,
  loading: true,
  currentOrganization: null,
  selectOrganization: async () => {},
  canAccessOrganization: () => false,
  hasRole: () => false,
  signUp: async () => ({ error: 'Fonction non initialisée' }),
  signInWithPassword: async () => ({ error: 'Fonction non initialisée' }),
  signOut: async () => {},
  refreshProfile: async () => {}
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fonction pour charger le profil utilisateur
  const loadProfile = useCallback(async (userId: string): Promise<AppProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      const profileData: AppProfile = {
        id: data.id,
        role: data.role || 'passenger',
        name: data.name || data.full_name || null,
        phone: data.phone || null,
        organizationId: data.organization_id || null,
        organizationName: data.organization_name || null,
      };
      setProfile(profileData);
      return profileData;
    } catch (error) {
      return null;
    }
  }, []);

  // Initialisation: restaurer la session existante et charger le profil (pas de déconnexion forcée)
  useEffect(() => {
    let cancelled = false;
    setMounted(true);

    const init = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        const currentSession = data?.session || null;
        setSession(currentSession);
        if (currentSession?.user?.id) {
          await loadProfile(currentSession.user.id);
        } else {
          setProfile(null);
          setCurrentOrganization(null);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la session:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      setMounted(false);
    };
  }, [loadProfile]);
  
  // Gestion des changements d'état d'authentification
  useEffect(() => {
    if (!mounted) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        switch (event) {
          case 'SIGNED_IN': {
            if (newSession?.user) {
              setSession(newSession);
              await loadProfile(newSession.user.id);
            }
            break;
          }
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED': {
            // Mettre à jour la session sans impacter le profil
            setSession(newSession);
            break;
          }
          case 'SIGNED_OUT': {
            setSession(null);
            setProfile(null);
            setCurrentOrganization(null);
            // Ne pas effacer le stockage ici; l'effacement complet se fait sur signOut() explicite
            break;
          }
          default:
            break;
        }
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [mounted, loadProfile]);

  const selectOrganization = useCallback(async (id: string | null, name?: string) => {
    if (!id) {
      setCurrentOrganization(null);
      return;
    }

    try {
      setCurrentOrganization({
        id,
        name: name || `Organization ${id}`
      });
    } catch (error) {
      console.error('Error selecting organization:', error);
    }
  }, []);

  const canAccessOrganization = useCallback((id: string | null) => {
    if (!id) return true; // Si pas d'organisation spécifiée, l'accès est autorisé
    if (!profile?.organizationId) return false;
    return profile.organizationId === id;
  }, [profile]);

  const hasRole = useCallback((requiredRole: string): boolean => {
    if (!profile) return false;
    
    const roleHierarchy: Record<string, number> = {
      'superadmin': 100,
      'admin': 80,
      'operator': 50,
      'passenger': 10
    };
    
    const userRoleLevel = roleHierarchy[profile.role.toLowerCase()] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole.toLowerCase()] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  }, [profile]);

  const signUp = useCallback(async ({ email, password, full_name, phone }: { 
    email: string; 
    password: string; 
    full_name?: string; 
    phone?: string;
  }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            phone
          }
        }
      });

      if (error) throw error;
      return { error: undefined };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error: error.message || 'Signup error' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithPassword = useCallback(async ({ email, password }: { email: string; password: string }) => {
    try {
      console.log('Tentative de connexion avec:', email);
      setLoading(true);
      
      console.log('URL de Supabase:', (import.meta as any).env?.VITE_SUPABASE_URL);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      console.log('Réponse de Supabase:', { 
        data: data ? 'Données reçues' : 'Aucune donnée',
        error: error ? error.message : 'Aucune erreur'
      });

      if (error) {
        console.error('Détails de l\'erreur Supabase:', {
          status: error.status,
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        // Vérification spécifique des erreurs courantes
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Veuillez confirmer votre adresse email avant de vous connecter');
        } else if (error.status === 400) {
          throw new Error('Requête invalide. Veuillez réessayer.');
        } else if (error.status === 500) {
          throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
        } else {
          throw error;
        }
      }
      
      if (!data?.user) {
        console.error('Aucun utilisateur dans la réponse de connexion');
        throw new Error('Réponse inattendue du serveur');
      }

      console.log('Utilisateur connecté, chargement du profil...', data.user.id);
      setSession(data.session);
      
      // Attendre que le profil soit chargé
      let profile = await loadProfile(data.user.id);
      console.log('Profil chargé:', profile);
      
      // Si aucun profil trouvé, créer un profil par défaut, puis recharger
      if (!profile) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            role: 'passenger',
            name: (data.user.email as string) || null,
            phone: null,
            organization_id: null,
          }, { onConflict: 'id' } as any);
        } catch (e) {
          console.warn('Création du profil par défaut échouée ou non nécessaire:', e);
        }
        profile = await loadProfile(data.user.id);
        console.log('Profil rechargé après création:', profile);
      }
      
      if (!profile) {
        console.error('Échec du chargement du profil utilisateur');
        throw new Error('Impossible de charger les informations du profil');
      }

      return { error: undefined };
    } catch (error: any) {
      console.error('Erreur détaillée de connexion:', {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      return { 
        error: error.message || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.' 
      };
    } finally {
      setLoading(false);
    }
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setProfile(null);
      setCurrentOrganization(null);
      cleanLocalStorage();
      
      // Redirection douce vers l'accueil (App)
      window.location.hash = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!session?.user?.id) return;
    await loadProfile(session.user.id);
  }, [session, loadProfile]);

  // Ré-hydration douce de session au retour sur l'onglet/fenêtre
  useEffect(() => {
    let disposed = false;
    const softlyRehydrate = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const currentSession = data?.session || null;
        if (disposed) return;
        if (currentSession?.user?.id) {
          // Mettre à jour la session si nécessaire
          if (!session || session?.user?.id !== currentSession.user.id) {
            setSession(currentSession);
          }
          // Recharger le profil si absent
          if (!profile) {
            await loadProfile(currentSession.user.id);
          }
        }
      } catch (e) {
        console.warn('Réhydratation de session ignorée:', e);
      }
    };

    const onFocus = () => softlyRehydrate();
    const onVisibility = () => { if (document.visibilityState === 'visible') softlyRehydrate(); };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      disposed = true;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [session, profile, loadProfile]);

  const value = useMemo(() => ({
    session,
    profile,
    loading,
    currentOrganization,
    selectOrganization,
    canAccessOrganization,
    hasRole,
    signUp,
    signInWithPassword,
    signOut,
    refreshProfile
  }), [
    session,
    profile,
    loading,
    currentOrganization,
    selectOrganization,
    canAccessOrganization,
    hasRole,
    signUp,
    signInWithPassword,
    signOut,
    refreshProfile
  ]);

  // Expose a global logout for non-hook components and simple buttons
  useEffect(() => {
    try {
      (window as unknown as { __signOut?: () => Promise<void> }).__signOut = signOut;
    } catch {}
    return () => {
      try {
        const w = (window as unknown as { __signOut?: () => Promise<void> });
        if (w.__signOut === signOut) w.__signOut = undefined;
      } catch {}
    };
  }, [signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);