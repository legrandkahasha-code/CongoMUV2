interface TripStats {
    total: number;
    en_cours: number;
    en_attente: number;
    termine: number;
    annule: number;
}
export declare const useTripsStats: () => {
    stats: TripStats;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};
export default useTripsStats;
