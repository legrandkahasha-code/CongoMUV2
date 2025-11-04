export declare const operators: {
    id: number;
    name: string;
    type: string;
    description: string;
    logo: string;
    services: string[];
}[];
export declare const transportTypes: {
    id: number;
    name: string;
    icon: string;
    operator_id: number;
    description: string;
}[];
export declare const routes: {
    id: number;
    operator_id: number;
    transport_type_id: number;
    departure_city: string;
    arrival_city: string;
    base_price: number;
    estimated_duration_minutes: number;
    distance_km: number;
    is_active: boolean;
}[];
export declare const trips: {
    id: number;
    route_id: number;
    departure_time: string;
    arrival_time: string;
    available_seats: number;
    vehicle_number: string;
    status: string;
    driver_name: string;
    total_seats: number;
}[];
export declare const bookings: {
    id: number;
    trip_id: number;
    user_id: string;
    booking_date: string;
    passenger_count: number;
    total_price: number;
    status: string;
    payment_status: string;
    payment_method: string;
    qr_code: string;
    ticket_number: string;
    passengers: {
        full_name: string;
        age: number;
        type: string;
    }[];
}[];
export declare const users: {
    id: string;
    email: string;
    phone: string;
    full_name: string;
    created_at: string;
}[];
export declare function searchTrips(params: {
    departureCity: string;
    arrivalCity: string;
    date: string;
    passengers: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    operator?: string;
    sortBy?: string;
}): {
    route: {
        operator: {
            id: number;
            name: string;
            type: string;
            description: string;
            logo: string;
            services: string[];
        } | null | undefined;
        transport_type: {
            id: number;
            name: string;
            icon: string;
            operator_id: number;
            description: string;
        } | null | undefined;
        id: number;
        operator_id: number;
        transport_type_id: number;
        departure_city: string;
        arrival_city: string;
        base_price: number;
        estimated_duration_minutes: number;
        distance_km: number;
        is_active: boolean;
    } | null;
    id: number;
    route_id: number;
    departure_time: string;
    arrival_time: string;
    available_seats: number;
    vehicle_number: string;
    status: string;
    driver_name: string;
    total_seats: number;
}[];
