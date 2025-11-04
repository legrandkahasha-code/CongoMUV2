export interface Operator {
  id: string;
  name: string;
}

export interface Vehicle {
  id: string;
  operatorId: string;
  name: string;
  licensePlate: string;
  type: string;
  seats: number;
}

export interface Route {
  id: string;
  departure_city: string;
  arrival_city: string;
  distance: number;
  duration: string;
}

export interface TripFormData {
  id?: string;
  routeId: string;
  vehicleId: string;
  operatorId: string;
  departureDate: Date | string;
  departureTime: string;
  arrivalDate: Date | string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  status: string;
  notes?: string;
}

export interface TripFormProps {
  initialData?: Partial<TripFormData>;
  operators: Operator[];
  vehicles: Vehicle[];
  routes: Route[];
  onSubmit: (data: TripFormData) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean; // Added isSubmitting property
}
