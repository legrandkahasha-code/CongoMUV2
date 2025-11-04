export declare const demoOperators: {
    id: string;
    name: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    created_at: string;
    updated_at: string;
    type: string;
    is_active: boolean;
    city: string;
    country: string;
}[];
export declare const demoRoutes: {
    id: string;
    operator_id: string;
    transport_type_id: string;
    departure_city: string;
    arrival_city: string;
    distance_km: number;
    estimated_duration_minutes: number;
    base_price: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}[];
export declare const demoTrips: {
    id: string;
    route_id: string;
    operator_id: string;
    departure_time: string;
    arrival_time: string;
    status: string;
    available_seats: number;
    price: number;
    created_at: string;
    updated_at: string;
    vehicle_number: string;
}[];
export declare const demoIncidents: {
    id: string;
    type: string;
    description: string;
    severity: string;
    status: string;
    location: string;
    created_at: string;
    date: string;
}[];
export declare const demoUsers: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    phone: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}[];
