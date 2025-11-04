/**
 * Système d'authentification 2FA robuste
 * CongoMuv E-Ticket
 */
export type AuthStep = 'email' | 'password' | 'otp' | 'success';
export type AuthError = 'invalid_email' | 'invalid_password' | 'invalid_otp' | 'network_error' | 'server_error';
export interface AuthState {
    step: AuthStep;
    email: string;
    password: string;
    otpCode: string;
    loading: boolean;
    error: AuthError | null;
    message: string | null;
}
export interface AuthResult {
    success: boolean;
    session?: Session | string;
    token?: string;
    user?: {
        id?: string;
        email?: string;
        role?: string;
        name?: string;
        organizationId?: string;
        [key: string]: any;
    };
    role?: string;
    error?: AuthError;
    message?: string;
    redirectTo?: string;
    [key: string]: any;
}
export interface Session {
    token: string;
    role?: string;
}
/**
 * Étape 1: Vérifier l'email et envoyer le code OTP
 */
export declare function initiate2FA(): Promise<AuthResult>;
/**
 * Étape 2: Vérifier le mot de passe (si configuré)
 */
export declare function verifyPassword(email: string, password: string): Promise<AuthResult>;
/**
 * Étape 3: Vérifier le code OTP
 * @param email L'email de l'utilisateur
 * @param otpCode Le code OTP à vérifier
 * @returns Un objet AuthResult avec les informations de session et de redirection
 */
export declare function verifyOTP(email: string, otpCode: string): Promise<AuthResult>;
/**
 * Déconnexion
 */
export declare function signOut(): Promise<void>;
/**
 * Vérifier si l'utilisateur est connecté
 */
export declare function getCurrentSession(): Promise<Session | null>;
