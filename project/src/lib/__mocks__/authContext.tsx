// Mock pour le fichier authContext.tsx
import React, { createContext, ReactNode } from 'react';

type AppProfile = {
  id: string;
  role: string;
  name: string | null;
  phone: string | null;
  organizationId: string | null;
  organizationName: string | null;
};

type AuthContextType = {
  session: any | null;
  profile: AppProfile | null;
  loading: boolean;
  currentOrganization: { id: string; name: string } | null;
  selectOrganization: (id: string | null, name?: string | null) => Promise<void>;
  canAccessOrganization: (id: string | null) => boolean;
  hasRole: (requiredRole: string) => boolean;
  signUp: (args: { email: string; password: string; full_name?: string | null; phone?: string | null }) => Promise<{ error?: string }>;
  signInWithPassword: (args: { email: string; password: string }) => Promise<{ error?: string; mfaRequired?: boolean; factorId?: string | null; challengeId?: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const mockProfile: AppProfile = {
  id: 'test-user-123',
  role: 'operator',
  name: 'Test Operator',
  phone: '+1234567890',
  organizationId: 'test-org-123',
  organizationName: 'Test Organization',
};

export const AuthContext = createContext<AuthContextType>({
  session: { user: { id: 'test-user-123' } },
  profile: mockProfile,
  loading: false,
  currentOrganization: { id: 'test-org-123', name: 'Test Organization' },
  selectOrganization: async () => {},
  canAccessOrganization: () => true,
  hasRole: (role) => role === 'operator',
  signUp: async () => ({}),
  signInWithPassword: async () => ({}),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        session: { user: { id: 'test-user-123' } },
        profile: mockProfile,
        loading: false,
        currentOrganization: { id: 'test-org-123', name: 'Test Organization' },
        selectOrganization: async () => {},
        canAccessOrganization: () => true,
        hasRole: (role) => role === 'operator',
        signUp: async () => ({}),
        signInWithPassword: async () => ({}),
        signOut: async () => {},
        refreshProfile: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return {
    session: { user: { id: 'test-user-123' } },
    profile: mockProfile,
    loading: false,
    currentOrganization: { id: 'test-org-123', name: 'Test Organization' },
    selectOrganization: async () => {},
    canAccessOrganization: () => true,
    hasRole: (role: string) => role === 'operator',
    signUp: async () => ({}),
    signInWithPassword: async () => ({}),
    signOut: async () => {},
    refreshProfile: async () => {},
  };
};

export default AuthProvider;
