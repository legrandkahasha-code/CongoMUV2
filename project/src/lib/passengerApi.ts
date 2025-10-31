/**
 * API Passager - Recherche de trajets
 * Interaction avec Supabase PostgreSQL
 * CongoMuv E-Ticket
 */

import { supabase } from './supabase';
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

function mapToTrip(row: Record<string, unknown>): Trip {
  const trip: Trip = {
    id: row.id as string,
    route_id: row.route_id as string,
    vehicle_id: row.vehicle_id as string | null,
    driver_id: row.driver_id as string | null,
    departure_datetime: row.departure_datetime as string,
    arrival_datetime: row.arrival_datetime as string,
    available_seats: row.available_seats as number,
    total_seats: row.total_seats as number,
    price: row.price as number,
    status: row.status as Trip['status'],
    delay_minutes: (row.delay_minutes as number) || 0,
    cancellation_reason: (row.cancellation_reason as string) || null,
    gate_number: (row.gate_number as string) || null,
    platform_number: (row.platform_number as string) || null,
    is_active: typeof row.is_active === 'boolean' ? row.is_active : true,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
  return trip;
}

export async function searchTrips(params: SearchParams): Promise<Trip[]> {
  const { departureCity, arrivalCity, date, maxPrice, minDuration, maxDuration, sortBy } = params;

  try {
  let query = supabase
    .from('trips')
      .select(`
        *,
        route:routes (
          *,
          operator:operators (
            id, name, type, is_active
          ),
          transport_type:transport_types (
            id, name, icon, description
          )
        )
      `)
      .eq('is_active', true)
      .in('status', ['scheduled', 'boarding']);

    // Filtres
  if (departureCity) {
      query = query.eq('route.departure_city_id', departureCity);
  }

  if (arrivalCity) {
      query = query.eq('route.arrival_city_id', arrivalCity);
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query
        .gte('departure_datetime', startDate.toISOString())
        .lt('departure_datetime', endDate.toISOString());
    }

    if (maxPrice) {
      query = query.lte('route.base_price', maxPrice);
    }

    if (minDuration) {
      query = query.gte('route.duration_minutes', minDuration);
    }

    if (maxDuration) {
      query = query.lte('route.duration_minutes', maxDuration);
    }

    // Tri
    if (sortBy === 'price') {
      query = query.order('route.base_price', { ascending: true });
    } else if (sortBy === 'duration') {
      query = query.order('route.duration_minutes', { ascending: true });
  } else {
      query = query.order('departure_datetime', { ascending: true });
  }

  const { data, error } = await query;

    if (error) {
      console.error('Error searching trips:', error);
      return [];
    }

    return (data || []).map(mapToTrip);
  } catch (error) {
    console.error('Error in searchTrips:', error);
    return [];
  }
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        route:routes (
          *,
          operator:operators (
            id, name, type, is_active
          ),
          transport_type:transport_types (
            id, name, icon, description
          )
        )
      `)
      .eq('id', tripId)
      .single();

    if (error) {
      console.error('Error getting trip:', error);
      return null;
    }

    return mapToTrip(data);
  } catch (error) {
    console.error('Error in getTripById:', error);
    return null;
  }
}

export async function getAvailableSeats(tripId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('available_seats')
      .eq('id', tripId)
      .single();

    if (error) {
      console.error('Error getting available seats:', error);
      return 0;
    }

    return data?.available_seats || 0;
  } catch (error) {
    console.error('Error in getAvailableSeats:', error);
    return 0;
  }
}

export async function updateAvailableSeats(tripId: string, seatsToReserve: number): Promise<boolean> {
  try {
    const { data: currentTrip, error: fetchError } = await supabase
      .from('trips')
      .select('available_seats')
      .eq('id', tripId)
      .single();

    if (fetchError) {
      console.error('Error fetching trip for seat update:', fetchError);
      return false;
    }

    const newAvailableSeats = Math.max(0, currentTrip.available_seats - seatsToReserve);

    const { error: updateError } = await supabase
      .from('trips')
      .update({ available_seats: newAvailableSeats })
      .eq('id', tripId);

    if (updateError) {
      console.error('Error updating available seats:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateAvailableSeats:', error);
    return false;
  }
}