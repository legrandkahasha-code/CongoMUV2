export declare const mockTrips: {
    id: string;
    route: {
        id: string;
        departure_city: string;
        arrival_city: string;
        distance: number;
        duration: string;
    };
    departure_time: string;
    arrival_time: string;
    vehicle_number: string;
    total_seats: number;
    available_seats: number;
    price: number;
    status: string;
    created_at: string;
    updated_at: string;
}[];
export declare const mockOperators: {
    id: string;
    name: string;
}[];
export declare const mockVehicles: {
    id: string;
    operatorId: string;
    name: string;
    licensePlate: string;
    type: string;
    seats: number;
}[];
export declare const mockRoutes: {
    id: string;
    departure_city: string;
    arrival_city: string;
    distance: number;
    duration: string;
}[];
