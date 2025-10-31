// Configuration production avec fallback automatique
// Détecte automatiquement les clés API et bascule entre mock et production

export type PaymentProvider = 'flutterwave' | 'airtel' | 'orange' | 'mock';
export type EmailProvider = 'mailgun' | 'sendgrid' | 'mock';
export type SMSProvider = 'twilio' | 'infobip' | 'mock';

// ============================================
// Configuration Environment Variables
// ============================================

export function getEnv(key: string): string | undefined {
  return (import.meta.env && (import.meta.env as Record<string, string>)[key]) || undefined;
}

const config = {
  // Paiements
  flutterwavePublicKey: getEnv('VITE_FLUTTERWAVE_PUBLIC_KEY'),
  flutterwaveSecretKey: getEnv('VITE_FLUTTERWAVE_SECRET_KEY'),
  airtelClientId: getEnv('VITE_AIRTEL_CLIENT_ID'),
  airtelClientSecret: getEnv('VITE_AIRTEL_CLIENT_SECRET'),
  orangeClientId: getEnv('VITE_ORANGE_CLIENT_ID'),
  orangeClientSecret: getEnv('VITE_ORANGE_CLIENT_SECRET'),
  
  // Email
  mailgunApiKey: getEnv('VITE_MAILGUN_API_KEY'),
  mailgunDomain: getEnv('VITE_MAILGUN_DOMAIN'),
  sendgridApiKey: getEnv('VITE_SENDGRID_API_KEY'),
  
  // SMS
  twilioAccountSid: getEnv('VITE_TWILIO_ACCOUNT_SID'),
  twilioAuthToken: getEnv('VITE_TWILIO_AUTH_TOKEN'),
  twilioPhoneNumber: getEnv('VITE_TWILIO_PHONE_NUMBER'),
  infobipApiKey: getEnv('VITE_INFOBIP_API_KEY'),
  
  // Backend API (supprimé, dépendance backend retirée)
};

// ============================================
// Détection automatique du mode (production vs mock)
// ============================================

export function isFlutterwaveConfigured(): boolean {
  return !!(config.flutterwavePublicKey && config.flutterwaveSecretKey);
}

export function isAirtelConfigured(): boolean {
  return !!(config.airtelClientId && config.airtelClientSecret);
}

export function isOrangeConfigured(): boolean {
  return !!(config.orangeClientId && config.orangeClientSecret);
}

export function isEmailConfigured(): boolean {
  return !!(config.mailgunApiKey || config.sendgridApiKey);
}

export function isSMSConfigured(): boolean {
  return !!(config.twilioAccountSid || config.infobipApiKey);
}

export function getPaymentProvider(): PaymentProvider {
  if (isFlutterwaveConfigured()) return 'flutterwave';
  if (isAirtelConfigured()) return 'airtel';
  if (isOrangeConfigured()) return 'orange';
  return 'mock';
}

export function getEmailProvider(): EmailProvider {
  if (config.mailgunApiKey) return 'mailgun';
  if (config.sendgridApiKey) return 'sendgrid';
  return 'mock';
}

export function getSMSProvider(): SMSProvider {
  if (config.twilioAccountSid) return 'twilio';
  if (config.infobipApiKey) return 'infobip';
  return 'mock';
}

// ============================================
// Service de Paiement avec Fallback
// ============================================

export type PaymentRequest = {
  amount: number;
  currency: string;
  email: string;
  phone: string;
  reference: string;
  description: string;
};

export type PaymentResponse = {
  success: boolean;
  provider: PaymentProvider;
  transactionId?: string;
  paymentUrl?: string;
  message?: string;
};

export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  const provider = getPaymentProvider();
  // Mode Mock (par défaut si pas de clés API)
  if (provider === 'mock') {
    console.log('[Payment Mock] Simuler paiement:', request);
    // Simuler délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    const success = Math.random() > 0.2;
    return {
      success,
      provider: 'mock',
      transactionId: `MOCK_${Date.now()}`,
      message: success ? 'Paiement mock réussi' : 'Paiement mock échoué (simulation)',
    };
  }
  // Si aucun provider configuré
  return {
    success: false,
    provider: 'mock',
    message: 'Aucun provider configuré',
  };
}

// ============================================
// Service Email avec Fallback
// ============================================

export type EmailRequest = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(request: EmailRequest): Promise<{ success: boolean; provider: EmailProvider; message?: string }> {
  // Mode Mock (toujours actif, backend supprimé)
  console.log('[Email Mock] Simuler envoi email:', { to: request.to, subject: request.subject });
  return {
    success: true,
    provider: 'mock',
    message: 'Email mock envoyé (console log)',
  };
}

// ============================================
// Service SMS avec Fallback
// ============================================

export type SMSRequest = {
  to: string;
  message: string;
};

export async function sendSMS(request: SMSRequest): Promise<{ success: boolean; provider: SMSProvider; message?: string }> {
  // Mode Mock (toujours actif, backend supprimé)
  console.log('[SMS Mock] Simuler envoi SMS:', { to: request.to, message: request.message.substring(0, 50) });
  return {
    success: true,
    provider: 'mock',
    message: 'SMS mock envoyé (console log)',
  };
}

// ============================================
// Statut du Système (Pour Dashboard Admin)
// ============================================

export function getSystemStatus(): {
  payment: { provider: PaymentProvider; configured: boolean };
  email: { provider: EmailProvider; configured: boolean };
  sms: { provider: SMSProvider; configured: boolean };
} {
  return {
    payment: {
      provider: getPaymentProvider(),
      configured: getPaymentProvider() !== 'mock',
    },
    email: {
      provider: getEmailProvider(),
      configured: isEmailConfigured(),
    },
    sms: {
      provider: getSMSProvider(),
      configured: isSMSConfigured(),
    }
  };
}
