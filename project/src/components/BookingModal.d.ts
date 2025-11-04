import { Trip } from '../types';
interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    trip: Trip | null;
    onSuccess: () => void;
}
export declare function BookingModal({ isOpen, onClose, trip, onSuccess }: BookingModalProps): JSX.Element | null;
export {};
