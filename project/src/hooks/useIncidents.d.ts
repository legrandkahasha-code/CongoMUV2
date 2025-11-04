interface Incident {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    severity: 'low' | 'medium' | 'high' | 'critical';
    created_by: string;
    assigned_to?: string;
    created_at: string;
    updated_at: string;
}
export declare const useIncidents: () => {
    incidents: Incident[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createIncident: (incidentData: Omit<Incident, "id" | "created_at" | "updated_at">) => Promise<any>;
    updateIncident: (id: string, updates: Partial<Incident>) => Promise<any>;
};
export default useIncidents;
