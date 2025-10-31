/**
 * Système d'authentification 2FA robuste
 * CongoMuv E-Ticket
 */

// Supabase only: backend API removed

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
  session?: Session | string; // Peut être un objet Session ou un token string
  token?: string; // Token JWT
  user?: {
    id?: string;
    email?: string;
    role?: string;
    name?: string;
    organizationId?: string;
    [key: string]: any; // Pour les propriétés supplémentaires
  };
  role?: string;
  error?: AuthError;
  message?: string;
  redirectTo?: string;
  [key: string]: any; // Pour les propriétés supplémentaires
}

export interface Session {
  token: string;
  role?: string;
}

/**
 * Étape 1: Vérifier l'email et envoyer le code OTP
 */
export async function initiate2FA(): Promise<AuthResult> {
  // Non utilisé: nous exigeons le mot de passe côté backend avant d'envoyer l'OTP
  return { success: false, error: 'server_error', message: 'Utiliser la vérification de mot de passe' };
}

/**
 * Étape 2: Vérifier le mot de passe (si configuré)
 */
export async function verifyPassword(email: string, password: string): Promise<AuthResult> {
  // TODO: Replace with Supabase signIn
  // Example mock logic
  if (email && password) {
    return { success: true, message: 'Code OTP envoyé à votre email' };
  }
  return { success: false, error: 'invalid_password', message: 'Email ou mot de passe invalide' };
}

/**
 * Étape 3: Vérifier le code OTP
 * @param email L'email de l'utilisateur
 * @param otpCode Le code OTP à vérifier
 * @returns Un objet AuthResult avec les informations de session et de redirection
 */
export async function verifyOTP(email: string, otpCode: string): Promise<AuthResult> {
  // TODO: Replace with Supabase verifyOtp
  // Example mock logic
  if (email && otpCode === '123456') {
    return {
      success: true,
      message: 'Connexion réussie',
      token: 'MOCK_TOKEN',
      session: 'MOCK_TOKEN',
      user: {
        id: 'MOCK_ID',
        email,
        role: 'user',
        name: email.split('@')[0],
        organizationId: 'MOCK_ORG'
      },
      role: 'user',
      redirectTo: '#/passager'
    };
  }
  return { success: false, error: 'invalid_otp', message: 'Code de vérification incorrect ou expiré' };
}

/**
 * Déconnexion
 */
export async function signOut(): Promise<void> {
  try {
    localStorage.removeItem('app_jwt');
  } catch (error) {
    console.error('[2FA] Sign out error:', error);
  }
}

/**
 * Vérifier si l'utilisateur est connecté
 */
export async function getCurrentSession(): Promise<Session | null> {
  const token = localStorage.getItem('app_jwt');
  return token ? { token } : null;
}
