interface Trip {
    id: string;
    route_id: string;
    vehicle_id: string;
    driver_id: string;
    departure_time: string;
    arrival_time: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    available_seats: number;
    price: number;
    created_at: string;
    updated_at: string;
}
export declare const useTrips: () => {
    trips: Trip[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createTrip: (tripData: Omit<Trip, "id" | "created_at" | "updated_at">) => Promise<any>;
};
export default useTrips;
