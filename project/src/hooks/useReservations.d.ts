interface Reservation {
    id: string;
    user_id: string;
    trip_id: string;
    seat_number: string;
    status: string;
    payment_status: string;
    amount: number;
    created_at: string;
    user_name?: string;
    user_email?: string;
    trip_departure?: string;
    trip_arrival?: string;
    trip_date?: string;
}
interface ReservationStats {
    total: number;
    today: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    revenue_total: number;
    revenue_today: number;
}
export declare const useReservations: () => {
    reservations: Reservation[];
    stats: ReservationStats;
    loading: boolean;
    error: string | null;
    refresh: (filter?: string) => Promise<void>;
    refreshStats: () => Promise<void>;
};
export default useReservations;
