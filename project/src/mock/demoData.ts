import { TransportOption } from '../types/passenger';
import { Trip } from '../types';

// Types de transport disponibles
export const TRANSPORT_OPTIONS: TransportOption[] = [
  {
    id: 'train',
    name: 'Train ONATRA',
    icon: 'Train',
    emoji: '🚂',
    description: 'Confortable et rapide'
  },
  {
    id: 'fluvial',
    name: 'Transport Fluvial',
    icon: 'Ship',
    emoji: '🚢',
    description: 'Navigation sur le fleuve'
  },
  {
    id: 'transco',
    name: 'Bus Transco',
    icon: 'Bus',
    emoji: '🚌',
    description: 'Bus inter-urbain'
  },
  {
    id: 'private',
    name: 'Transport Privé',
    icon: 'Car',
    emoji: '🚗',
    description: 'Véhicule privé'
  }
];

// Villes disponibles
export const CITIES = [
  { id: '1', name: 'Kinshasa' },
  { id: '2', name: 'Lubumbashi' },
  { id: '3', name: 'Matadi' },
  { id: '4', name: 'Goma' },
  { id: '5', name: 'Kisangani' },
  { id: '6', name: 'Bukavu' },
  { id: '7', name: 'Kolwezi' },
  { id: '8', name: 'Kamina' },
  { id: '9', name: 'Mbandaka' },
  { id: '10', name: 'Bandundu' },
  { id: '11', name: 'Mbuji-Mayi' },
  { id: '12', name: 'Kananga' }
];

// Générer des trajets de démonstration
export const generateDemoTrips = (): Trip[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  return [
    // 1. TRAIN ONATRA - Kinshasa → Matadi (Train express)
    {
      id: 1,
      route_id: 1,
      departure_time: new Date(tomorrow.setHours(8, 0)).toISOString(),
      arrival_time: new Date(tomorrow.setHours(15, 0)).toISOString(),
      available_seats: 45,
      vehicle_number: 'TRAIN-001',
      total_seats: 50,
      status: 'scheduled',
      route: {
        id: 1,
        operator_id: 1,
        transport_type_id: 1,
        departure_city: 'Kinshasa',
        arrival_city: 'Matadi',
        distance_km: 350,
        estimated_duration_minutes: 420,
        base_price: 35000,
        is_active: true,
        operator: { id: 1, name: 'Train ONATRA', type: 'train', is_active: true }
      }
    },
    // 2. FLUVIAL - Kinshasa → Kisangani (Bateau)
    {
      id: 2,
      route_id: 2,
      departure_time: new Date(tomorrow.setHours(10, 30)).toISOString(),
      arrival_time: new Date(tomorrow.setHours(18, 0)).toISOString(),
      available_seats: 120,
      vehicle_number: 'BOAT-001',
      total_seats: 150,
      status: 'scheduled',
      route: {
        id: 2,
        operator_id: 2,
        transport_type_id: 2,
        departure_city: 'Kinshasa',
        arrival_city: 'Kisangani',
        distance_km: 800,
        estimated_duration_minutes: 450,
        base_price: 80000,
        is_active: true,
        operator: { id: 2, name: 'Transport Fluvial ONATRA', type: 'fluvial', is_active: true }
      }
    },
    // 3. TRANSCO - Kinshasa → Lubumbashi (Bus longue distance)
    {
      id: 3,
      route_id: 3,
      departure_time: new Date(tomorrow.setHours(16, 0)).toISOString(),
      arrival_time: new Date(dayAfter.setHours(4, 0)).toISOString(),
      available_seats: 28,
      vehicle_number: 'BUS-TRANSCO-001',
      total_seats: 50,
      status: 'scheduled',
      route: {
        id: 3,
        operator_id: 3,
        transport_type_id: 3,
        departure_city: 'Kinshasa',
        arrival_city: 'Lubumbashi',
        distance_km: 1800,
        estimated_duration_minutes: 720,
        base_price: 150000,
        is_active: true,
        operator: { id: 3, name: 'Bus Transco', type: 'transco', is_active: true }
      }
    },
    // 4. PRIVÉ - Kinshasa → Goma (Transport privé)
    {
      id: 4,
      route_id: 4,
      departure_time: new Date(dayAfter.setHours(8, 0)).toISOString(),
      arrival_time: new Date(dayAfter.setHours(14, 0)).toISOString(),
      available_seats: 12,
      vehicle_number: 'PRIV-001',
      total_seats: 25,
      status: 'scheduled',
      route: {
        id: 4,
        operator_id: 4,
        transport_type_id: 4,
        departure_city: 'Kinshasa',
        arrival_city: 'Goma',
        distance_km: 1800,
        estimated_duration_minutes: 360,
        base_price: 180000,
        is_active: true,
        operator: { id: 4, name: 'Transport Privé VIP', type: 'private', is_active: true }
      }
    }
  ];
};

// Initialiser les données de démonstration dans le localStorage
export const initializeDemoData = () => {
  // Toujours régénérer les trajets pour avoir les types corrects
  const demoTrips = generateDemoTrips();
  localStorage.setItem('demo_trips', JSON.stringify(demoTrips));
  
  // Ne pas toucher aux réservations existantes
  if (!localStorage.getItem('demo_bookings')) {
    localStorage.setItem('demo_bookings', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('demo_initialized')) {
    localStorage.setItem('demo_initialized', 'true');
  }
};

export default {
  TRANSPORT_OPTIONS,
  CITIES,
  generateDemoTrips,
  initializeDemoData
};
