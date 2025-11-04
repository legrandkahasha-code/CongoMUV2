interface Route {
    id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: number;
    status: 'active' | 'inactive' | 'maintenance';
    created_at: string;
    updated_at: string;
}
export declare const useRoutes: () => {
    routes: Route[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createRoute: (routeData: any) => Promise<any>;
};
export default useRoutes;
