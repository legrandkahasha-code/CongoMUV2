import { ReactNode } from 'react';
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
    currentOrganization: {
        id: string;
        name: string;
    } | null;
    selectOrganization: (id: string | null, name?: string | null) => Promise<void>;
    canAccessOrganization: (id: string | null) => boolean;
    hasRole: (requiredRole: string) => boolean;
    signUp: (args: {
        email: string;
        password: string;
        full_name?: string | null;
        phone?: string | null;
    }) => Promise<{
        error?: string;
    }>;
    signInWithPassword: (args: {
        email: string;
        password: string;
    }) => Promise<{
        error?: string;
        mfaRequired?: boolean;
        factorId?: string | null;
        challengeId?: string | null;
    }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
};
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): JSX.Element;
export declare function useAuth(): AuthContextType;
export {};
