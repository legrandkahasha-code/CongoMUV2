import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Trip } from '../types';

// Interface pour la réservation
interface Booking {
  id: string;
  trip_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  booking_reference: string;
  number_of_passengers: number;
  total_amount: number;
  trip: Trip;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (trip: Trip, passengers: number) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  getBookingById: (id: string) => Booking | undefined;
  getUserBookings: (userId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const STORAGE_KEY = 'congo_muv_bookings';
  
  const [bookings, setBookings] = useState<Booking[]>(() => {
    // Charger les réservations depuis le localStorage au démarrage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Erreur lors du chargement des réservations:', error);
        return [];
      }
    }
    return [];
  });

  // Sauvegarder les réservations dans le localStorage
  const saveBookings = useCallback((newBookings: Booking[]) => {
    setBookings(newBookings);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookings));
    }
  }, []);

  // Ajouter une nouvelle réservation
  const addBooking = useCallback((trip: Trip, passengers: number): Booking => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      trip_id: String(trip.id),
      user_id: 'current-user-id', // À remplacer par l'ID de l'utilisateur connecté
      status: 'pending',
      created_at: new Date().toISOString(),
      booking_reference: `CM-${Date.now()}`,
      number_of_passengers: passengers,
      total_amount: trip.route?.base_price ? trip.route.base_price * passengers : 0,
      trip: trip
    };
    
    const updatedBookings = [...bookings, newBooking];
    saveBookings(updatedBookings);
    return newBooking;
  }, [bookings, saveBookings]);

  // Mettre à jour le statut d'une réservation
  const updateBookingStatus = useCallback((bookingId: string, status: Booking['status']) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    );
    saveBookings(updatedBookings);
  }, [bookings, saveBookings]);

  // Obtenir une réservation par son ID
  const getBookingById = useCallback((id: string) => {
    return bookings.find(booking => booking.id === id);
  }, [bookings]);

  // Obtenir les réservations d'un utilisateur
  const getUserBookings = useCallback((userId: string) => {
    return bookings.filter(booking => booking.user_id === userId);
  }, [bookings]);

  const value = {
    bookings,
    addBooking,
    updateBookingStatus,
    getBookingById,
    getUserBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings doit être utilisé à l\'intérieur d\'un BookingProvider');
  }
  return context;
};
