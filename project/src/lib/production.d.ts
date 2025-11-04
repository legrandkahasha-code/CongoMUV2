export type PaymentProvider = 'flutterwave' | 'airtel' | 'orange' | 'mock';
export type EmailProvider = 'mailgun' | 'sendgrid' | 'mock';
export type SMSProvider = 'twilio' | 'infobip' | 'mock';
export declare function getEnv(key: string): string | undefined;
export declare function isFlutterwaveConfigured(): boolean;
export declare function isAirtelConfigured(): boolean;
export declare function isOrangeConfigured(): boolean;
export declare function isEmailConfigured(): boolean;
export declare function isSMSConfigured(): boolean;
export declare function getPaymentProvider(): PaymentProvider;
export declare function getEmailProvider(): EmailProvider;
export declare function getSMSProvider(): SMSProvider;
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
export declare function initiatePayment(request: PaymentRequest): Promise<PaymentResponse>;
export type EmailRequest = {
    to: string;
    subject: string;
    html: string;
    text?: string;
};
export declare function sendEmail(request: EmailRequest): Promise<{
    success: boolean;
    provider: EmailProvider;
    message?: string;
}>;
export type SMSRequest = {
    to: string;
    message: string;
};
export declare function sendSMS(request: SMSRequest): Promise<{
    success: boolean;
    provider: SMSProvider;
    message?: string;
}>;
export declare function getSystemStatus(): {
    payment: {
        provider: PaymentProvider;
        configured: boolean;
    };
    email: {
        provider: EmailProvider;
        configured: boolean;
    };
    sms: {
        provider: SMSProvider;
        configured: boolean;
    };
};
