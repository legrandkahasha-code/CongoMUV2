// Mock pour le fichier production.ts

// Simuler import.meta.env pour les tests
const mockEnv: Record<string, string | undefined> = {
  'VITE_APP_ENCRYPTION_KEY': 'test-encryption-key',
  'VITE_SUPABASE_URL': 'https://test-supabase-url.supabase.co',
  'VITE_SUPABASE_ANON_KEY': 'test-supabase-anon-key',
  'VITE_FLUTTERWAVE_PUBLIC_KEY': 'test-flutterwave-public-key',
  'VITE_FLUTTERWAVE_SECRET_KEY': 'test-flutterwave-secret-key',
  'VITE_MAILGUN_API_KEY': 'test-mailgun-api-key',
  'VITE_MAILGUN_DOMAIN': 'test.mailgun.org',
  'VITE_SENDGRID_API_KEY': 'test-sendgrid-api-key',
  'VITE_TWILIO_ACCOUNT_SID': 'test-twilio-sid',
  'VITE_TWILIO_AUTH_TOKEN': 'test-twilio-token',
  'VITE_INFOBIP_API_KEY': 'test-infobip-key',
  'VITE_INFOBIP_BASE_URL': 'https://test.infobip.com',
};

export function getEnv(key: string): string | undefined {
  return mockEnv[key];
}

// Exporter les fonctions nécessaires pour les tests
export const isFlutterwaveConfigured = () => true;
export const isAirtelConfigured = () => false;
export const isOrangeConfigured = () => false;
export const isEmailConfigured = () => true;
export const isSMSConfigured = () => true;

export const getPaymentProvider = () => 'flutterwave' as const;
export const getEmailProvider = () => 'mailgun' as const;
export const getSMSProvider = () => 'twilio' as const;

export const initiatePayment = async () => ({
  success: true,
  provider: 'flutterwave',
  transactionId: 'test-tx-123',
  paymentUrl: 'https://test-payment-url.com',
});

export const sendEmail = async () => ({
  success: true,
  provider: 'mailgun',
  message: 'Email sent successfully',
});

export const sendSMS = async () => ({
  success: true,
  provider: 'twilio',
  message: 'SMS sent successfully',
});

export const getSystemStatus = () => ({
  payment: { provider: 'flutterwave', configured: true },
  email: { provider: 'mailgun', configured: true },
  sms: { provider: 'twilio', configured: true },
});

export default {
  getEnv,
  isFlutterwaveConfigured,
  isAirtelConfigured,
  isOrangeConfigured,
  isEmailConfigured,
  isSMSConfigured,
  getPaymentProvider,
  getEmailProvider,
  getSMSProvider,
  initiatePayment,
  sendEmail,
  sendSMS,
  getSystemStatus,
};
