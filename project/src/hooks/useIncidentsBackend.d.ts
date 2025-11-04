interface Incident {
    id: string;
    operator_id?: string;
    trip_id?: string;
    type: string;
    severity: string;
    status: string;
    description: string;
    date?: string;
    location?: string;
    created_at: string;
    updated_at: string;
}
export declare const useIncidentsBackend: () => {
    incidents: Incident[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createIncident: (incidentData: Omit<Incident, "id" | "created_at" | "updated_at">) => Promise<{
        id: string;
        created_at: string;
        updated_at: string;
        date?: string | undefined;
        type: string;
        description: string;
        status: string;
        severity: string;
        operator_id?: string | undefined;
        trip_id?: string | undefined;
        location?: string | undefined;
    }>;
    updateIncident: (id: string, updates: Partial<Incident>) => Promise<Partial<Incident>>;
};
export default useIncidentsBackend;
