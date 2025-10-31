// 1. Imports
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Ticket, 
  LogOut, 
  Clock, 
  Info
} from 'lucide-react';

// Types et interfaces
import { TransportTypeEnum } from '../types/passenger';
import { Trip } from '../types';

// Composants
import { PassengerBookingModal } from '../components/PassengerBookingModal';
import { MyTripsModal } from '../components/MyTripsModal';
import { PaymentModal } from '../components/PaymentModal';
import { SupportFAQ } from '../components/SupportFAQ';

// Données de démonstration
import { 
  TRANSPORT_OPTIONS, 
  CITIES, 
  initializeDemoData,
  generateDemoTrips
} from '../mock/demoData';

// 2. Types supplémentaires
type ActiveTab = 'home' | 'trips' | 'support';

// 3. Fonctions utilitaires
const formatTime = (dateString: string) => (
  new Date(dateString).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
);

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? `${mins}m` : ''}`;
};

// 4. Composant principal
export function PassengerApp() {
  // Initialisation des données de démonstration
  useEffect(() => {
    initializeDemoData();
  }, []);

  // 5. États pour la navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  
  // 6. États pour la recherche
  const [selectedTransport, setSelectedTransport] = useState<TransportTypeEnum | ''>('');
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  
  // 7. États pour les données
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities] = useState<Array<{ id: string; name: string }>>(CITIES);
  
  // 8. États pour les modales
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [currentBookingId, setCurrentBookingId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  
  // 9. État utilisateur simulé
  const [user] = useState({
    id: 'demo-user-123',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    token: 'demo-token-123'
  });

  // 10. Effets
  // Chargement initial des données
  useEffect(() => {
    const loadTrips = () => {
      try {
        const savedTrips = localStorage.getItem('demo_trips');
        if (savedTrips) {
          const parsedTrips = JSON.parse(savedTrips);
          setTrips(parsedTrips);
          setFilteredTrips(parsedTrips);
        } else {
          const demoData = generateDemoTrips();
          setTrips(demoData);
          setFilteredTrips(demoData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des trajets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  // Filtrer les trajets en fonction des critères de recherche
  useEffect(() => {
    let result = [...trips];

    if (selectedTransport) {
      result = result.filter(trip => 
        trip.route?.operator?.type === selectedTransport
      );
    }

    if (departureCity) {
      result = result.filter(trip => 
        trip.route?.departure_city.toLowerCase().includes(departureCity.toLowerCase())
      );
    }

    if (arrivalCity) {
      result = result.filter(trip => 
        trip.route?.arrival_city.toLowerCase().includes(arrivalCity.toLowerCase())
      );
    }

    if (departureDate) {
      const selectedDate = new Date(departureDate);
      result = result.filter(trip => {
        const tripDate = new Date(trip.departure_time);
        return (
          tripDate.getFullYear() === selectedDate.getFullYear() &&
          tripDate.getMonth() === selectedDate.getMonth() &&
          tripDate.getDate() === selectedDate.getDate()
        );
      });
    }

    setFilteredTrips(result);
  }, [selectedTransport, departureCity, arrivalCity, departureDate, trips]);

  // 11. Gestionnaires d'événements
  const handleLogout = () => {
    localStorage.removeItem('app_jwt');
    localStorage.removeItem('app_role');
    window.location.hash = '#/login';
  };

  const handleTransportSelect = (transportType: TransportTypeEnum) => {
    setSelectedTransport(prev => prev === transportType ? '' : transportType);
  };

  const handleBookTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (bookingId: string, amount: number) => {
    setCurrentBookingId(bookingId);
    setPaymentAmount(amount);
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    setShowPaymentModal(false);
    // Recharger les trajets pour mettre à jour les disponibilités
    window.location.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Le filtrage se fait automatiquement via le useEffect
  };

  const resetFilters = () => {
    setSelectedTransport('');
    setDepartureCity('');
    setArrivalCity('');
    setDepartureDate('');
  };

  // 12. Rendu du composant
  // Les données de démonstration sont maintenant gérées dans demoData.ts
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-700">CongoMuv</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 text-sm font-medium ${activeTab === 'home' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Accueil
              </button>
              <button 
                onClick={() => setActiveTab('trips')}
                className={`px-3 py-2 text-sm font-medium ${activeTab === 'trips' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                <Ticket className="inline-block w-4 h-4 mr-1" />
                Mes voyages
              </button>
              <button 
                onClick={() => setActiveTab('support')}
                className={`px-3 py-2 text-sm font-medium ${activeTab === 'support' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                <Info className="inline-block w-4 h-4 mr-1" />
                Aide
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Bonjour, {user?.name}</span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="inline-block w-4 h-4 mr-1" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <>
            {/* Section de recherche */}
            <section className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trouvez votre prochain voyage</h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                    <input
                      type="text"
                      id="departure"
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                      placeholder="Ville de départ"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      list="cities"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="arrival" className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
                    <input
                      type="text"
                      id="arrival"
                      value={arrivalCity}
                      onChange={(e) => setArrivalCity(e.target.value)}
                      placeholder="Ville d'arrivée"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      list="cities"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      id="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Rechercher
                    </button>
                  </div>
                </div>
                
                {(selectedTransport || departureCity || arrivalCity || departureDate) && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </form>
              
              <datalist id="cities">
                {cities.map((city: { id: string; name: string }) => (
                  <option key={city.id} value={city.name} />
                ))}
              </datalist>
              
              {/* Filtres de transport */}
              <div className="mt-6">
                <div className="flex flex-wrap gap-3">
                  {TRANSPORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleTransportSelect(option.id as TransportTypeEnum)}
                      className={`flex items-center px-4 py-2 rounded-full border ${
                        selectedTransport === option.id
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-2">{option.emoji}</span>
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Liste des trajets */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Trajets disponibles</h2>
                <span className="text-sm text-gray-500">
                  {filteredTrips.length} trajet{filteredTrips.length !== 1 ? 's' : ''} trouvé{filteredTrips.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredTrips.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">Aucun trajet trouvé pour vos critères de recherche.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTrips.map((trip: Trip) => (
                    <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="text-2xl mr-3">
                                {TRANSPORT_OPTIONS.find(t => t.id === trip.route?.operator?.type)?.emoji || '🚌'}
                              </span>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {trip.route?.departure_city} → {trip.route?.arrival_city}
                              </h3>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                <span>Départ: {formatTime(trip.departure_time)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                <span>Arrivée: {formatTime(trip.arrival_time)}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                <span>Durée: {formatDuration(trip.route?.estimated_duration_minutes || 0)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {trip.route?.base_price?.toLocaleString('fr-FR')} FC
                            </div>
                            <div className="text-sm text-gray-500 mb-4">
                              {trip.available_seats} place{trip.available_seats > 1 ? 's' : ''} disponible{trip.available_seats !== 1 ? 's' : ''}
                            </div>
                            <button
                              onClick={() => handleBookTrip(trip)}
                              className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Réserver
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
        
        {activeTab === 'trips' && (
          <MyTripsModal isOpen={true} onClose={() => setActiveTab('home')} />
        )}
        
        {activeTab === 'support' && (
          <SupportFAQ isOpen={true} onClose={() => setActiveTab('home')} />
        )}
      </main>

      {/* Modales */}
      {showBookingModal && selectedTrip && (
        <PassengerBookingModal
          trip={selectedTrip}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedTrip(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}

      {showPaymentModal && currentBookingId && (
        <PaymentModal
          isOpen={showPaymentModal}
          bookingId={currentBookingId}
          amount={paymentAmount}
          onClose={() => {
            setShowPaymentModal(false);
            setCurrentBookingId('');
            setPaymentAmount(0);
          }}
          onSuccess={handlePaymentSuccess}
      />
      )}
    </div>
  );
}
