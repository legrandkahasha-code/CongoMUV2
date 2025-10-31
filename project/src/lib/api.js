import axios from 'axios';


// Mocks non destructifs pour neutraliser les appels backend
export const authApi = {
  login: async () => ({ success: false, message: 'Auth handled by Supabase. Use supabase.auth.signInWithPassword.' }),
  register: async () => ({ success: false, message: 'Auth handled by Supabase. Use supabase.auth.signUp.' }),
  getProfile: async () => ({ success: false, message: 'Profile provided by Supabase profiles table.' }),
  updateProfile: async () => ({ success: false, message: 'Update profile via Supabase client.' }),
};

export const bookingApi = {
  createBooking: async (bookingData) => ({ booking: bookingData, status: 'created' }),
  getBookings: async () => ([]),
  getBookingById: async (id) => ({ id, status: 'mock', details: {} }),
  updateBooking: async (id, updates) => ({ id, ...updates }),
  cancelBooking: async (id) => ({ id, status: 'cancelled' }),
};

export const routeApi = {
  createRoute: async () => ({ success: false, message: 'Not available (backend removed).'}),
  getRoutes: async () => ({ items: [] }),
  getRouteById: async () => null,
  updateRoute: async () => ({ success: false, message: 'Not available (backend removed).'}),
  deleteRoute: async () => ({ success: false, message: 'Not available (backend removed).'}),
  getRouteSchedule: async (id) => ({ routeId: id, schedule: [], route: null }),
};

export const tripApi = {
  createTrip: async () => ({ success: false, message: 'Not available (backend removed).'}),
  getTrips: async () => ({ items: [] }),
  getTripById: async () => null,
  updateTrip: async () => ({ success: false, message: 'Not available (backend removed).'}),
  deleteTrip: async () => ({ success: false, message: 'Not available (backend removed).'}),
  getAvailableSeats: async (tripId) => ({ tripId, seats: [] }),
};

export const vehicleApi = {
  createVehicle: async () => ({ success: false, message: 'Not available (backend removed).'}),
  getVehicles: async () => ({ items: [] }),
  getVehicleById: async () => null,
  updateVehicle: async () => ({ success: false, message: 'Not available (backend removed).'}),
  deleteVehicle: async () => ({ success: false, message: 'Not available (backend removed).'}),
};

export const userApi = {
  getUsers: async () => ([]),
  getUserById: async (id) => ({ id, name: 'Mock User' }),
  createUser: async (userData) => ({ user: userData, status: 'created' }),
  updateUser: async (id, updates) => ({ id, ...updates }),
  deleteUser: async (id) => ({ id, status: 'deleted' }),
};

export default {
  auth: authApi,
  booking: bookingApi,
  route: routeApi,
  trip: tripApi,
  vehicle: vehicleApi,
  user: userApi,
};
