interface PaymentModalProps {
    isOpen: boolean;
    bookingId: string;
    amount: number;
    onClose: () => void;
    onSuccess: (paymentId: string) => void;
}
export declare function PaymentModal({ isOpen, bookingId, amount, onClose, onSuccess }: PaymentModalProps): JSX.Element | null;
export {};
