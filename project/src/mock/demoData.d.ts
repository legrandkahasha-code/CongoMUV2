import { TransportOption } from '../types/passenger';
import { Trip } from '../types';
export declare const TRANSPORT_OPTIONS: TransportOption[];
export declare const CITIES: {
    id: string;
    name: string;
}[];
export declare const generateDemoTrips: () => Trip[];
export declare const initializeDemoData: () => void;
declare const _default: {
    TRANSPORT_OPTIONS: TransportOption[];
    CITIES: {
        id: string;
        name: string;
    }[];
    generateDemoTrips: () => Trip[];
    initializeDemoData: () => void;
};
export default _default;
