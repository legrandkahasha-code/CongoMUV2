import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';
import { decryptString } from './crypto';
import { supabase } from './supabase';

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
  session: import('@supabase/supabase-js').Session | null;
  profile: AppProfile | null;
  loading: boolean;
  currentOrganization: Organization | null;
  selectOrganization: (id: string | null, name?: string | null) => Promise<void>;
  canAccessOrganization: (id: string | null) => boolean;
  hasRole: (requiredRole: string) => boolean;
  signUp: (args: { email: string; password: string; full_name?: string | null; phone?: string | null }) => Promise<{ error?: string }>;
  signInWithPassword: (args: { email: string; password: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  loading: true,
  currentOrganization: null,
  selectOrganization: async () => {},
  canAccessOrganization: () => false,
  hasRole: () => false,
  signUp: async () => ({}),
  signInWithPassword: async () => ({}),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger le profil utilisateur
  const loadProfile = useCallback(async (userId: string): Promise<AppProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, name, phone, organization_id')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Décrypter le numéro de téléphone si nécessaire
      let phoneDecrypted = data.phone;
      if (phoneDecrypted) {
        try {
          phoneDecrypted = await decryptString(phoneDecrypted);
        } catch (e) {
          console.warn("Impossible de décrypter le numéro de téléphone:", e);
        }
      }

      const profileData: AppProfile = {
        id: data.id,
        role: data.role,
        name: data.name,
        phone: phoneDecrypted,
        organizationId: data.organization_id,
        organizationName: null,
      };

      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      setProfile(null);
      return null;
    }
  }, []);

  // Recharger le profil
  const refreshProfile = useCallback(async () => {
    if (!session?.user?.id) return;
    return loadProfile(session.user.id);
  }, [session, loadProfile]);

  // Gestion de la connexion
  const signInWithPassword = useCallback(async ({ email, password }: { email: string; password: string }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;
      return { data };
    } catch (error: any) {
      return { error: error.message || 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Gestion de l'inscription
  const signUp = useCallback(async ({ email, password, full_name, phone }: { 
    email: string; 
    password: string; 
    full_name?: string | null; 
    phone?: string | null;
  }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: full_name || undefined,
            phone: phone || undefined,
          },
        },
      });

      if (error) throw error;
      return {};
    } catch (error: any) {
      return { error: error.message || 'Erreur lors de l\'inscription' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Gestion de la déconnexion
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      setCurrentOrganization(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = useCallback((requiredRole: string) => {
    if (!profile?.role) return false;
    
    const roleHierarchy: Record<string, number> = {
      'super_admin': 1000,
      'admin': 100,
      'operator': 50,
      'user': 10
    };
    
    const userRole = profile.role.toLowerCase();
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole.toLowerCase()] || 0;
    
    return userLevel >= requiredLevel;
  }, [profile]);

  // Vérifier si l'utilisateur peut accéder à une organisation
  const canAccessOrganization = useCallback((orgId: string | null) => {
    if (!profile) return false;
    if (!orgId) return true;
    if (hasRole('super_admin')) return true;
    return profile.organizationId === orgId;
  }, [profile, hasRole]);

  // Sélectionner une organisation
  const selectOrganization = useCallback(async (orgId: string | null, name?: string | null) => {
    if (!orgId) {
      setCurrentOrganization(null);
      return;
    }
    
    if (name) {
      setCurrentOrganization({ id: orgId, name });
      return;
    }
    
    // Si le nom n'est pas fourni, le récupérer depuis la base de données
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('id', orgId)
        .single();
        
      if (error) throw error;
      setCurrentOrganization({ id: data.id, name: data.name });
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'organisation:', error);
      setCurrentOrganization({ id: orgId, name: orgId });
    }
  }, []);

  // Effet pour gérer les changements d'état d'authentification
  useEffect(() => {
    // Vérifier la session actuelle au chargement
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        // Charger le profil si l'utilisateur est connecté
        await loadProfile(session.user.id);
        
        // Rediriger en fonction du rôle après connexion
        if (event === 'SIGNED_IN') {
          const profile = await loadProfile(session.user.id);
          if (profile) {
            const role = profile.role.toLowerCase();
            let redirectPath = '/';
            
            if (role === 'admin') redirectPath = '/admin';
            else if (role === 'operator') redirectPath = '/operator';
            else if (role === 'passenger') redirectPath = '/passenger';
            
            if (window.location.pathname !== redirectPath) {
              window.location.href = redirectPath;
            }
          }
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadProfile]);

  // Valeur du contexte
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
    refreshProfile: async () => {
      if (session?.user?.id) {
        await loadProfile(session.user.id);
      }
    },
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
    loadProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger le profil utilisateur
  const loadProfile = useCallback(async (userId: string): Promise<AppProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, name, phone, organization_id')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Décrypter le numéro de téléphone si nécessaire
      let phoneDecrypted = data.phone;
      if (phoneDecrypted) {
        try {
          phoneDecrypted = await decryptString(phoneDecrypted);
        } catch (e) {
          console.warn("Impossible de décrypter le numéro de téléphone:", e);
        }
      }

      const profileData: AppProfile = {
        id: data.id,
        role: data.role,
        name: data.name,
        phone: phoneDecrypted,
        organizationId: data.organization_id,
        organizationName: null,
      };

      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      setProfile(null);
      return null;
    }
  }, []);

  // Recharger le profil
  const refreshProfile = useCallback(async () => {
    if (!session?.user?.id) return;
    return loadProfile(session.user.id);
  }, [session, loadProfile]);

  // Gestion de la connexion
  const signInWithPassword = useCallback(async ({ email, password }: { email: string; password: string }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;
      return { data };
    } catch (error: any) {
      return { error: error.message || 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Gestion de l'inscription
  const signUp = useCallback(async ({ email, password, full_name, phone }: { 
    email: string; 
    password: string; 
    full_name?: string; 
    phone?: string 
  }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name,
            phone,
          },
        },
      });

      if (error) throw error;
      return { data };
    } catch (error: any) {
      return { error: error.message || 'Erreur lors de l\'inscription' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Gestion de la déconnexion
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      setCurrentOrganization(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gestion du changement d'état d'authentification
  useEffect(() => {
    // Vérifier la session actuelle au chargement
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        // Charger le profil si l'utilisateur est connecté
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadProfile]);

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = useCallback((requiredRole: string) => {
    if (!profile?.role) return false;
    
    const roleHierarchy = {
      'super_admin': 1000,
      'admin': 100,
      'operator': 50,
      'user': 10
    };
    
    const userRole = profile.role.toLowerCase();
    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole.toLowerCase() as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  }, [profile]);

  // Vérifier si l'utilisateur peut accéder à une organisation
  const canAccessOrganization = useCallback((orgId: string | null) => {
    if (!profile) return false;
    if (!orgId) return true;
    if (hasRole('super_admin')) return true;
    return profile.organizationId === orgId;
  }, [profile, hasRole]);

  // Sélectionner une organisation
  const selectOrganization = useCallback(async (orgId: string | null, name?: string) => {
    if (!orgId) {
      setCurrentOrganization(null);
      return;
    }
    
    if (name) {
      setCurrentOrganization({ id: orgId, name });
      return;
    }
    
    // Si le nom n'est pas fourni, le récupérer depuis la base de données
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('id', orgId)
        .single();
        
      if (error) throw error;
      setCurrentOrganization({ id: data.id, name: data.name });
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'organisation:', error);
      setCurrentOrganization({ id: orgId, name: orgId });
    }
  }, []);

  // Valeur du contexte
  const value = useMemo(() => ({
    session,
    profile,
    loading,
    currentOrganization,
    selectOrganization: async (id: string | null, name?: string | null) => {
      if (name === undefined) name = null;
      return selectOrganization(id, name || undefined);
    },
    canAccessOrganization,
    hasRole,
    signUp: async (args: { email: string; password: string; full_name?: string | null; phone?: string | null }) => {
      return signUp({
        email: args.email,
        password: args.password,
        full_name: args.full_name || undefined,
        phone: args.phone || undefined
      });
    },
    signInWithPassword,
    signOut,
    refreshProfile,
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
    refreshProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    try {
      const emailLower = args.email.trim().toLowerCase();
      const { error } = await supabase.auth.signUp({
        email: emailLower,
        password: args.password,
        options: { data: { full_name: args.full_name ?? null, phone: args.phone ?? null } },
      });
      if (error) return { error: error.message || 'Signup failed' };
      // Éviter toute session active après inscription: forcer la déconnexion pour exiger une connexion explicite
      try { await supabase.auth.signOut(); } catch {}
      return {};
    } catch (e: any) {
      return { error: e?.message || 'Signup failed' };
    }
  }, []);

  const signInWithPassword = useCallback(async (args: { email: string; password: string }): Promise<{ error?: string }> => {
    try {
      const emailLower = args.email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithPassword({ email: emailLower, password: args.password });
      if (error) return { error: error.message || 'Login failed' };
      return {};
    } catch (e: any) {
      return { error: e?.message || 'Login failed' };
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      try { if (typeof localStorage !== 'undefined') localStorage.clear(); } catch {}
      try { if (typeof sessionStorage !== 'undefined') sessionStorage.clear(); } catch {}
    } catch {}
  }, []);

  // Fonction pour charger le profil utilisateur depuis la base de données
  const loadProfile = async (userId: string): Promise<AppProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, name, phone, organization_id')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.error('Failed to load profile:', error);
        setProfile(null);
        return null;
      }
      if (!data) {
        setProfile(null);
        return null;
      }
      let phoneDecrypted: string | null = data.phone ?? null;
      if (phoneDecrypted) {
        try {
          phoneDecrypted = await decryptString(phoneDecrypted);
        } catch (error) {
          console.warn("Failed to decrypt phone number, using original value:", error);
        }
      }
      const p: AppProfile = {
        id: data.id,
        role: data.role,
        name: data.name ?? null,
        phone: phoneDecrypted,
        organizationId: data.organization_id ?? null,
        organizationName: null,
      };
      setProfile(p);
      return p;
    } catch (e) {
      console.error('Failed to load profile (unexpected):', e);
      setProfile(null);
      return null;
    }
  };

  // Recharger le profil courant depuis la base (utile si le rôle a changé côté serveur)
  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session: current } } = await supabase.auth.getSession();
      const userId = current?.user?.id || session?.user?.id || null;
      if (!userId) return;
      const p = await loadProfile(userId);
      setProfile(p);
    } catch {}
  }, [session]);

  // Charger la session et le profil au démarrage
  useEffect(() => {
    // Vérifier la session actuelle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
      async (
        event: import('@supabase/supabase-js').AuthChangeEvent,
        newSession: import('@supabase/supabase-js').Session | null,
      ) => {
        setSession(newSession);

        // Ne charger le profil QUE lors d'un SIGNED_IN puis rediriger selon le rôle
        if (event === 'SIGNED_IN') {
          // Ne jamais rediriger si on est sur une page d'auth (signup/register), pour éviter le "boom" après inscription
          const h = (typeof window !== 'undefined' ? window.location.hash : '') || '';
          if (h.startsWith('#/signup') || h.startsWith('#/register')) {
            return;
          }
          let p: AppProfile | null = null;
          if (newSession?.user?.id) {
            p = await loadProfile(newSession.user.id);
            setProfile(p ?? null);
          } else {
            setProfile(null);
          }

          const localProfile = p ?? null;
          const r = ((localProfile?.role) || '').toLowerCase();

          // Si aucun profil ou role vide → ne pas rediriger
          if (!localProfile || !r) {
            return;
          }

          // MFA/OTP désactivés: aucune vérification supplémentaire

          // Déterminer la cible selon le rôle
          let target = '/passenger'; // Par défaut: passenger (PassengerApp)
          if (r === 'superadmin' || r === 'super_admin') {
            target = '/superadmin';
          } else if (r === 'admin') {
            target = '/admin/dashboard';
          } else if (r === 'operator') {
            target = '/operator/dashboard';
          } else if (r === 'driver' || r === 'chauffeur') {
            target = '/driver/dashboard';
          } else if (r === 'passenger') {
            target = '/passenger'; // PassengerApp pour les passengers
          }

          // Ajouter organization_id si nécessaire
          const orgId = localProfile?.organizationId || null;
          if (orgId && (r === 'operator' || r === 'admin')) {
            target = `${target}?org=${encodeURIComponent(String(orgId))}`;
          }

          // Redirection immédiate
          if (window.location.hash !== `#${target}`) {
            window.location.hash = `#${target}`;
          }

          // Fallback rapide (500ms au lieu de 1200ms)
          setTimeout(() => {
            const h = window.location.hash || '';
            if (!h || h === '#/' || h === '#/login') {
              window.location.hash = `#${target}`;
            }
          }, 500);

          return;
        }

        if (event === 'SIGNED_OUT') {
          try {
            if (typeof localStorage !== 'undefined') localStorage.clear();
            if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
          } catch {}
          try {
            if (typeof document !== 'undefined') {
              document.cookie.split(';').forEach(c => {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/');
              });
            }
          } catch {}
          window.location.hash = '#/';
          return;
        }

        // Lorsque le token est rafraîchi ou l'utilisateur mis à jour, recharger le profil pour refléter un rôle changé côté serveur
        if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await refreshProfile();
          return;
        }
      }
    );

    // Rafraîchir le profil au retour sur l'onglet (pour refléter un changement de rôle externe)
    const onVisible = () => {
      try {
        if (document.visibilityState === 'visible' && session) {
          refreshProfile();
        }
      } catch {}
    };
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', onVisible);
    }

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
      if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
        document.removeEventListener('visibilitychange', onVisible);
      }
    };
  }, []);

  // Déplacement de `selectOrganization` dans un hook `useCallback`
  const selectOrganization = useCallback(async (id: string | null, name?: string | null) => {
    if (!id) {
      setCurrentOrganization(null);
      return;
    }
    const isSuper = profile?.role === 'superadmin';
    if (!isSuper && profile?.organizationId && profile.organizationId !== id) {
      console.warn('Tentative de sélection d\'organisation non autorisée', id);
      return;
    }
    if (name) {
      setCurrentOrganization({ id, name });
      return;
    }
    try {
      const { data: orgData, error: orgErr } = await supabase
        .from('operators')
        .select('id,name')
        .eq('id', id)
        .maybeSingle();
      if (!orgErr && orgData) {
        setCurrentOrganization({ id: String(orgData.id), name: orgData.name });
      } else {
        setCurrentOrganization({ id, name: id });
      }
    } catch (e) {
      console.warn('Erreur lors de la sélection de l\'organisation:', e);
      setCurrentOrganization({ id, name: id });
    }
  }, [profile]);

  // Déplacement de `canAccessOrganization` dans un hook `useCallback`
  const canAccessOrganization = useCallback((id: string | null) => {
    if (!id) return true;
    if (!profile) return false;
    if (profile.role === 'superadmin') return true;
    if (!profile.organizationId) return false;
    return profile.organizationId === id;
  }, [profile]);

  // Vérifie si l'utilisateur a un rôle spécifique en tenant compte de la hiérarchie
  const hasRole = useCallback((requiredRole: string) => {
    if (!profile?.role) return false;
    
    const roleHierarchy = {
      'super_admin': 1000,
      'admin': 100,
      'operator': 50,
      'user': 10
    };
    
    const userRole = profile.role.toLowerCase();
    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  }, [profile]);

  // Mise à jour de `useMemo` pour inclure les hooks
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
    refreshProfile,
  }), [session, profile, loading, currentOrganization, selectOrganization, canAccessOrganization, hasRole, signUp, signInWithPassword, signOut, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
