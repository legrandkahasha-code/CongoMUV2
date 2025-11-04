export type City = {
    id: string;
    name: string;
    province: string;
    latitude?: number;
    longitude?: number;
    is_active?: boolean;
};
export type TransportType = {
    id: string;
    name: string;
    icon: string;
    is_active?: boolean;
};
export type Operator = {
    id: string;
    name: string;
    type: string;
    contact_email?: string;
    contact_phone?: string;
    is_active: boolean;
};
export declare function initializeAppData(): void;
export declare function getCities(): Promise<City[]>;
export declare function getCitiesSync(): City[];
export declare function getCityById(id: string): Promise<City | null>;
export declare function getCityByName(name: string): Promise<City | null>;
export declare function addCity(city: Omit<City, 'id'>): Promise<City | null>;
export declare function getTransportTypes(): Promise<TransportType[]>;
export declare function getTransportTypesSync(): TransportType[];
export declare function getTransportTypeById(id: string): Promise<TransportType | null>;
export declare function getOperators(): Promise<Operator[]>;
export declare function getOperatorsSync(): Operator[];
export declare function getActiveOperators(): Promise<Operator[]>;
export declare function getOperatorById(id: string): Promise<Operator | null>;
export declare function addOperator(operator: Omit<Operator, 'id'>): Promise<Operator | null>;
export declare function updateOperator(id: string, updates: Partial<Operator>): Promise<Operator | null>;
export declare function deleteOperator(id: string): Promise<boolean>;
export declare function searchCities(query: string): Promise<City[]>;
export declare function getPopularRoutes(): Array<{
    from: string;
    to: string;
    count: number;
}>;
