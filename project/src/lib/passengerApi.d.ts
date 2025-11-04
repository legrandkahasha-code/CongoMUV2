/**
 * API Passager - Recherche de trajets
 * Interaction avec Supabase PostgreSQL
 * CongoMuv E-Ticket
 */
import type { Trip } from '../types/database.types';
export interface SearchParams {
    departureCity: string;
    arrivalCity: string;
    date: string;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    sortBy?: 'departure_time' | 'price' | 'duration';
}
export declare function searchTrips(params: SearchParams): Promise<Trip[]>;
export declare function getTripById(tripId: string): Promise<Trip | null>;
export declare function getAvailableSeats(tripId: string): Promise<number>;
export declare function updateAvailableSeats(tripId: string, seatsToReserve: number): Promise<boolean>;
