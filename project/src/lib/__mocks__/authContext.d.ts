import React, { ReactNode } from 'react';
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
export declare const AuthContext: React.Context<AuthContextType>;
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
export declare const useAuth: () => {
    session: {
        user: {
            id: string;
        };
    };
    profile: AppProfile;
    loading: boolean;
    currentOrganization: {
        id: string;
        name: string;
    };
    selectOrganization: () => Promise<void>;
    canAccessOrganization: () => boolean;
    hasRole: (role: string) => role is "operator";
    signUp: () => Promise<{}>;
    signInWithPassword: () => Promise<{}>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
};
export default AuthProvider;
