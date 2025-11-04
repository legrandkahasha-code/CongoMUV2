import { Trip as ImportedTrip } from '../types';
export declare function useBooking(): {
    showBookingModal: boolean;
    setShowBookingModal: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    selectedTrip: ImportedTrip | null;
    setSelectedTrip: import("react").Dispatch<import("react").SetStateAction<ImportedTrip | null>>;
    handleBookNow: (trip: ImportedTrip) => void;
    handleBookingSuccess: () => void;
};
