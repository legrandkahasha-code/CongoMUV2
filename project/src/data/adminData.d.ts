export type AdminRole = 'ONATRA' | 'TRANSCO' | 'PRIVATE' | 'CONGOMUV_HQ';
export interface AdminStats {
    totalBookings: number;
    totalRevenue: number;
    activeTrips: number;
    totalPassengers: number;
    onTimeRate: number;
    satisfactionRate: number;
    incidentReports: number;
}
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    organization: string;
    permissions: string[];
}
export declare const adminUsers: AdminUser[];
export declare const adminStats: Record<AdminRole, AdminStats>;
export interface IncidentReport {
    id: string;
    date: string;
    type: 'mechanical' | 'delay' | 'security' | 'other';
    description: string;
    status: 'open' | 'investigating' | 'resolved';
    severity: 'low' | 'medium' | 'high';
    operator: string;
    location: string;
}
export declare const incidentReports: IncidentReport[];
