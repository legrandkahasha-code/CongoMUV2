import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { mockTrips, mockOperators, mockVehicles, mockRoutes } from '../../data/mockTrips';
import { Operator, Vehicle, Route } from '../trips/TripForm.types';

interface Trip {
  id: string;
  route: {
    id: string;
    departure_city: string;
    arrival_city: string;
    distance: number;
    duration: string;
  };
  departure_time: string;
  arrival_time: string;
  vehicle_number: string;
  total_seats: number;
  available_seats: number;
  price: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface EditingTripForm {
  id: string;
  routeId: string;
  departureDate: Date;
  departureTime: string;
  arrivalDate: Date;
  arrivalTime: string;
  vehicle_number: string;
  total_seats: number;
  available_seats: number;
  price: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export function TripsManagement() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingTrip, setEditingTrip] = useState<EditingTripForm | null>(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    setLoading(true);
    try {
      setTrips(
        mockTrips.map(trip => ({
          ...trip,
          route:
            mockRoutes.find(r => r.id === trip.route.id) || {
              id: 'unknown',
              departure_city: 'Inconnu',
              arrival_city: 'Inconnu',
              distance: 0,
              duration: '0h',
            },
        }))
      );
    } catch (error) {
      console.error('Erreur chargement trajets:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trip: Trip) => {
    const departureDate = new Date(trip.departure_time);
    const arrivalDate = new Date(trip.arrival_time);

    const formData: EditingTripForm = {
      id: trip.id,
      routeId: trip.route.id,
      departureDate,
      departureTime: `${String(departureDate.getHours()).padStart(2, '0')}:${String(departureDate.getMinutes()).padStart(2, '0')}`,
      arrivalDate,
      arrivalTime: `${String(arrivalDate.getHours()).padStart(2, '0')}:${String(arrivalDate.getMinutes()).padStart(2, '0')}`,
      vehicle_number: trip.vehicle_number,
      total_seats: trip.total_seats,
      available_seats: trip.available_seats,
      price: trip.price,
      status: trip.status,
      created_at: trip.created_at,
      updated_at: trip.updated_at,
    };

    setEditingTrip(formData);
    setShowModal(true);
  };

  const handleDelete = (tripId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce trajet ?')) return;

    try {
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return 'Programmé';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Trajets</h2>
          <p className="text-sm text-slate-600">Ajout, modification et suppression des lignes</p>
        </div>
        <button
          onClick={() => {
            setEditingTrip(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Trajet</span>
        </button>
      </div>

      {/* Trips List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {trip.route.departure_city} → {trip.route.arrival_city}
                      </h3>
                      <p className="text-sm text-slate-600">Véhicule: {trip.vehicle_number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                      {getStatusLabel(trip.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Départ</p>
                        <p className="text-sm font-medium">{formatDateTime(trip.departure_time)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Arrivée</p>
                        <p className="text-sm font-medium">{formatDateTime(trip.arrival_time)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-600">Places</p>
                        <p className="text-sm font-medium">
                          {trip.available_seats}/{trip.total_seats} disponibles
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(trip)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    aria-label="Modifier le trajet"
                    title="Modifier"
                  >
                    <span>✏️</span>
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    aria-label="Supprimer le trajet"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">{editingTrip ? 'Modifier le trajet' : 'Créer un nouveau trajet'}</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);

                // On récupère la date courante et on construit la date complète avec heure pour departure et arrival
                const nowDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
                const departureDateTime = new Date(`${nowDate}T${formData.get('departure_time') as string}`);
                const arrivalDateTime = new Date(`${nowDate}T${formData.get('arrival_time') as string}`);

                const newTrip: Trip = {
                  id: editingTrip?.id ?? `t-${Date.now()}`,
                  route: mockRoutes.find(r => r.id === (formData.get('route_id') as string)) || mockRoutes[0],
                  departure_time: departureDateTime.toISOString(),
                  arrival_time: arrivalDateTime.toISOString(),
                  vehicle_number: formData.get('vehicle_number') as string,
                  total_seats: parseInt(formData.get('total_seats') as string, 10),
                  available_seats: parseInt(formData.get('available_seats') as string, 10),
                  price: parseFloat(formData.get('price') as string),
                  status: editingTrip?.status || 'scheduled',
                  created_at: editingTrip?.created_at || new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                setTrips(prev => {
                  if (editingTrip) {
                    // Mise à jour d’un trajet existant
                    return prev.map(t => (t.id === newTrip.id ? newTrip : t));
                  } else {
                    // Ajout d’un nouveau trajet
                    return [newTrip, ...prev];
                  }
                });
                setShowModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Route</label>
                <select
                  name="route_id"
                  aria-label="Sélectionner un itinéraire"
                  defaultValue={editingTrip?.routeId || mockRoutes[0].id}
                  className="w-full border rounded px-3 py-2"
                >
                  {mockRoutes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.departure_city} → {route.arrival_city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Heure de départ</label>
                <input
                  type="time"
                  name="departure_time"
                  required
                  aria-label="Heure de départ"
                  placeholder="HH:MM"
                  defaultValue={editingTrip?.departureTime}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Heure d'arrivée</label>
                <input
                  type="time"
                  name="arrival_time"
                  required
                  aria-label="Heure d'arrivée"
                  placeholder="HH:MM"
                  defaultValue={editingTrip?.arrivalTime}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Véhicule</label>
                <select
                  name="vehicle_number"
                  aria-label="Sélectionner un véhicule"
                  defaultValue={editingTrip?.vehicle_number}
                  className="w-full border rounded px-3 py-2"
                >
                  {mockVehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.licensePlate}>
                      {vehicle.licensePlate}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre total de sièges</label>
                <input
                  type="number"
                  name="total_seats"
                  required
                  aria-label="Nombre total de sièges"
                  placeholder="Entrez le nombre total de sièges"
                  min="1"
                  defaultValue={editingTrip?.total_seats}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de sièges disponibles</label>
                <input
                  type="number"
                  name="available_seats"
                  required
                  aria-label="Nombre de sièges disponibles"
                  placeholder="Entrez le nombre de sièges disponibles"
                  min="0"
                  defaultValue={editingTrip?.available_seats}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prix</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  required
                  aria-label="Prix du trajet"
                  placeholder="Entrez le prix du trajet"
                  min="0"
                  defaultValue={editingTrip?.price}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 border rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
