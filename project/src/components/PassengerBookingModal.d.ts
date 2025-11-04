import { Trip } from '../types';
interface PassengerBookingModalProps {
    trip: Trip;
    onClose: () => void;
    onSuccess: (bookingId: string, amount: number) => void;
}
export declare function PassengerBookingModal({ trip, onClose, onSuccess }: PassengerBookingModalProps): JSX.Element;
export {};
