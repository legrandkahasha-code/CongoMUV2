export declare function getEnv(key: string): string | undefined;
export declare const isFlutterwaveConfigured: () => boolean;
export declare const isAirtelConfigured: () => boolean;
export declare const isOrangeConfigured: () => boolean;
export declare const isEmailConfigured: () => boolean;
export declare const isSMSConfigured: () => boolean;
export declare const getPaymentProvider: () => "flutterwave";
export declare const getEmailProvider: () => "mailgun";
export declare const getSMSProvider: () => "twilio";
export declare const initiatePayment: () => Promise<{
    success: boolean;
    provider: string;
    transactionId: string;
    paymentUrl: string;
}>;
export declare const sendEmail: () => Promise<{
    success: boolean;
    provider: string;
    message: string;
}>;
export declare const sendSMS: () => Promise<{
    success: boolean;
    provider: string;
    message: string;
}>;
export declare const getSystemStatus: () => {
    payment: {
        provider: string;
        configured: boolean;
    };
    email: {
        provider: string;
        configured: boolean;
    };
    sms: {
        provider: string;
        configured: boolean;
    };
};
declare const _default: {
    getEnv: typeof getEnv;
    isFlutterwaveConfigured: () => boolean;
    isAirtelConfigured: () => boolean;
    isOrangeConfigured: () => boolean;
    isEmailConfigured: () => boolean;
    isSMSConfigured: () => boolean;
    getPaymentProvider: () => "flutterwave";
    getEmailProvider: () => "mailgun";
    getSMSProvider: () => "twilio";
    initiatePayment: () => Promise<{
        success: boolean;
        provider: string;
        transactionId: string;
        paymentUrl: string;
    }>;
    sendEmail: () => Promise<{
        success: boolean;
        provider: string;
        message: string;
    }>;
    sendSMS: () => Promise<{
        success: boolean;
        provider: string;
        message: string;
    }>;
    getSystemStatus: () => {
        payment: {
            provider: string;
            configured: boolean;
        };
        email: {
            provider: string;
            configured: boolean;
        };
        sms: {
            provider: string;
            configured: boolean;
        };
    };
};
export default _default;
