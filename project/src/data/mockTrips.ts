// Données simulées pour les trajets
export const mockTrips = [
  {
    id: 'trip-1',
    route: {
      id: 'route-1',
      departure_city: 'Kinshasa',
      arrival_city: 'Matadi',
      distance: 350,
      duration: '5h30'
    },
    departure_time: '2025-11-01T08:00:00',
    arrival_time: '2025-11-01T13:30:00',
    vehicle_number: 'CGO-1234',
    total_seats: 30,
    available_seats: 15,
    price: 15000,
    status: 'scheduled',
    created_at: '2025-10-25T10:00:00',
    updated_at: '2025-10-25T10:00:00'
  },
  {
    id: 'trip-2',
    route: {
      id: 'route-2',
      departure_city: 'Kinshasa',
      arrival_city: 'Kikwit',
      distance: 500,
      duration: '8h00'
    },
    departure_time: '2025-11-02T07:00:00',
    arrival_time: '2025-11-02T15:00:00',
    vehicle_number: 'CGO-5678',
    total_seats: 28,
    available_seats: 28,
    price: 20000,
    status: 'scheduled',
    created_at: '2025-10-26T09:30:00',
    updated_at: '2025-10-26T09:30:00'
  }
];

// Opérateurs et véhicules simulés
export const mockOperators = [
  { id: 'op-1', name: 'Trans Congo Express' },
  { id: 'op-2', name: 'Congo Voyageurs' },
  { id: 'op-3', name: 'Bus Express RDC' }
];

export const mockVehicles = [
  { id: 'v-1', operatorId: 'op-1', name: 'Bus VIP', licensePlate: 'CGO-1234', type: 'Grand tourisme', seats: 30 },
  { id: 'v-2', operatorId: 'op-1', name: 'Bus Standard', licensePlate: 'CGO-5678', type: 'Climatisé', seats: 28 },
  { id: 'v-3', operatorId: 'op-2', name: 'Minibus', licensePlate: 'CGO-9012', type: 'Confort', seats: 18 },
  { id: 'v-4', operatorId: 'op-3', name: 'Bus de luxe', licensePlate: 'CGO-3456', type: 'VIP', seats: 20 }
];

export const mockRoutes = [
  { id: 'route-1', departure_city: 'Kinshasa', arrival_city: 'Matadi', distance: 350, duration: '5h30' },
  { id: 'route-2', departure_city: 'Kinshasa', arrival_city: 'Kikwit', distance: 500, duration: '8h00' },
  { id: 'route-3', departure_city: 'Kinshasa', arrival_city: 'Mbuji-Mayi', distance: 1200, duration: '24h00' }
];
