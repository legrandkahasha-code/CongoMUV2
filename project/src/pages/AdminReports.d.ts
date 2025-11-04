import { Trip } from '../types';
import { Payment } from '../lib/logs';
export interface AdminReportsProps {
    isOpen: boolean;
    onClose: () => void;
    data?: {
        bookings?: unknown[];
        payments?: Payment[];
        trips?: Trip[];
    };
}
export default function AdminReports({ isOpen, onClose, data }: AdminReportsProps): JSX.Element | null;
