export type AdminRole = 'CONGOMUV_HQ' | 'OPERATOR' | string;
export type Operator = {
    id: string;
    name: string;
    type?: string;
    logo?: string;
    is_active?: boolean;
};
export type Route = {
    id: string;
    departure_city: string;
    arrival_city: string;
    base_price: number;
    operator?: Operator | null;
};
export type TripWithRelations = {
    id: string;
    departure_time: string;
    arrival_time: string | null;
    vehicle_number: string | null;
    total_seats: number;
    available_seats: number;
    status: string;
    route: Route | null;
};
export type IncidentItem = {
    id: string;
    type: string;
    description: string | null;
    severity: 'low' | 'medium' | 'high' | string;
    status: string;
    date: string;
    operator: string;
};
export declare function fetchActiveTrips(role: AdminRole, organizationName?: string, operatorId?: string): Promise<TripWithRelations[]>;
export declare function fetchRecentIncidents(role: AdminRole, organizationName?: string, limit?: number, operatorId?: string): Promise<IncidentItem[]>;
export declare function fetchAdminStats(_role: AdminRole, _organizationName?: string): Promise<{
    totalBookings: number;
    totalRevenue: number;
    activeTrips: number;
    totalPassengers: number;
    onTimeRate: number;
    satisfactionRate: number;
    incidentReports: number;
}>;
