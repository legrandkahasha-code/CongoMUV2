import { useState } from 'react';
import { useAuth } from './lib/authContext';
import { Trip as ImportedTrip } from './types';
import { cities } from './features/cities';
import { formatTime, formatDuration } from './utils/passengerUtils';
import { Ticket, ArrowRight, Clock, CheckCircle, MapPin, ShieldCheck, Star } from 'lucide-react';
import { BookingModal } from './components/BookingModal';
import { MyTripsModal } from './components/MyTripsModal';
import AuthButtons from './components/AuthButtons';

export default function App() {
  const { session } = useAuth();
  const isAuthenticated = !!session;
  const [search, setSearch] = useState({ departure: '', arrival: '', date: '', transport: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<ImportedTrip | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  // Loader global pour transitions
  const showLoader = loading;
  // Mock data pour les trajets
  const mockTrips: ImportedTrip[] = [
    {
      id: 1,
      route_id: 1,
      departure_time: '2025-10-30T08:00:00',
      arrival_time: '2025-10-30T11:00:00',
      vehicle_number: 'A123',
      available_seats: 12,
      total_seats: 50,
      status: 'active',
      route: {
        id: 1,
        operator_id: 1,
        transport_type_id: 1,
        operator: {
          id: 1,
          name: 'TransCongo',
          type: 'Bus',
        },
        transport_type: {
          id: 1,
          name: 'Bus',
          icon: '',
          description: 'Bus classique',
        },
        departure_city: 'Kinshasa',
        arrival_city: 'Lubumbashi',
        base_price: 35000,
        estimated_duration_minutes: 180,
        distance_km: 2000,
        is_active: true,
      },
    },
    // ...add more mock trips as needed...
  ];
  // Filter trips based on search
  const filteredTrips = mockTrips.filter(trip => {
    const matchDeparture = search.departure ? trip.route?.departure_city?.toLowerCase().includes(search.departure.toLowerCase()) : true;
    const matchArrival = search.arrival ? trip.route?.arrival_city?.toLowerCase().includes(search.arrival.toLowerCase()) : true;
    const t = search.transport?.toLowerCase();
    const matchTransport = t
      ? (trip.route?.transport_type?.name?.toLowerCase().includes(t) || trip.route?.operator?.type?.toLowerCase().includes(t))
      : true;
    return matchDeparture && matchArrival && matchTransport;
  });

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTotalResults(filteredTrips.length);
    }, 400);
  };

  // Booking logic (désactivé sur la page d'accueil)
  // const handleBookNow = (trip: ImportedTrip) => {
  //   setGlobalLoading(true);
  //   setTimeout(() => {
  //     setSelectedTrip(trip);
  //     setShowBookingModal(true);
  //     setGlobalLoading(false);
  //   }, 300);
  // };
  // const handleBookingSuccess = () => {
  //   setShowBookingModal(false);
  //   setSelectedTrip(null);
  //   // Optionally show a success message
  // };
// ...existing code...
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Loader global */}
      {showLoader && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-700 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-blue-700 font-semibold">Chargement...</span>
          </div>
        </div>
      )}
      {/* Header avec AuthButtons en haut à droite */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-700">CongoMuv</div>
        <div className="flex items-center gap-4">
          <AuthButtons />
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section + Formulaire de recherche centré */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-16 flex flex-col items-center justify-center">
          {/* Décor de fond subtil */}
          <div className="absolute inset-0 opacity-10 pointer-events-none -z-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 right-10 w-56 h-56 bg-blue-300 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-300 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 max-w-3xl w-full px-4">
            <h2 className="text-4xl font-extrabold mb-3 text-center tracking-tight">Voyagez en toute simplicité</h2>
            <p className="text-blue-100 text-center mb-6">Réservez, suivez et voyagez partout en RDC avec une expérience fluide et sécurisée.</p>
            <form className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 flex flex-col gap-5 border border-slate-100 text-slate-900" onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="w-full">
                  <label htmlFor="search-transport" className="block text-sm font-medium text-slate-700 mb-1">Type de transport</label>
                  <div className="relative">
                    <select
                      id="search-transport"
                      className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-slate-900"
                      value={search.transport}
                      onChange={(e) => setSearch(s => ({ ...s, transport: e.target.value }))}
                      title="Type de transport"
                      aria-describedby="hint-transport"
                    >
                      <option value="">Tous les transports</option>
                      <option value="bus">Bus</option>
                      <option value="train">Train</option>
                      <option value="fluvial">Fluvial</option>
                      <option value="private">Privé</option>
                    </select>
                  </div>
                  <p id="hint-transport" className="mt-1 text-xs text-slate-500">Filtrer (optionnel)</p>
                </div>
                <div className="w-full">
                  <label htmlFor="search-departure" className="block text-sm font-medium text-slate-700 mb-1">Ville de départ</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <input
                      id="search-departure"
                      list="citiesList"
                      className="border border-slate-300 rounded-lg pl-9 pr-3 py-2 w-full bg-white text-slate-900 placeholder-slate-400 shadow-inner caret-sky-600 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      placeholder="Ex: Kinshasa"
                      aria-describedby="hint-departure"
                      title="Ville de départ"
                      value={search.departure}
                      onChange={e => setSearch(s => ({ ...s, departure: e.target.value }))}
                      required
                    />
                  </div>
                  <p id="hint-departure" className="mt-1 text-xs text-slate-500">Exemples: Kinshasa, Lubumbashi, Goma...</p>
                </div>
                <div className="w-full">
                  <label htmlFor="search-arrival" className="block text-sm font-medium text-slate-700 mb-1">Ville d'arrivée</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <input
                      id="search-arrival"
                      list="citiesList"
                      className="border rounded-lg pl-9 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-slate-900 placeholder-slate-400"
                      placeholder="Ex: Lubumbashi"
                      aria-describedby="hint-arrival"
                      title="Ville d'arrivée"
                      value={search.arrival}
                      onChange={e => setSearch(s => ({ ...s, arrival: e.target.value }))}
                      required
                    />
                  </div>
                  <p id="hint-arrival" className="mt-1 text-xs text-slate-500">Exemples: Matadi, Kolwezi, Bukavu...</p>
                </div>
                <div className="w-full">
                  <label htmlFor="search-date" className="block text-sm font-medium text-slate-700 mb-1">Date du trajet</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Clock className="w-4 h-4" />
                    </span>
                    <input
                      id="search-date"
                      type="date"
                      className="border rounded-lg pl-9 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-slate-900 placeholder-slate-400"
                      aria-describedby="hint-date"
                      title="Date du trajet"
                      value={search.date}
                      onChange={e => setSearch(s => ({ ...s, date: e.target.value }))}
                      required
                    />
                  </div>
                  <p id="hint-date" className="mt-1 text-xs text-slate-500">Sélectionnez votre date de départ</p>
                </div>
              </div>
              <button type="submit" aria-label="Rechercher un trajet" className="bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-blue-800 hover:to-blue-700 transition shadow-lg">Rechercher</button>
            </form>
            {/* CTA sous le formulaire */}
            <div className="mt-4 flex items-center justify-center">
              <a href="#results" className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-md">
                <span>Découvrir nos trajets</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
          <datalist id="citiesList">
            {cities.map(c => (<option key={c.id} value={c.name} />))}
          </datalist>
        </section>
      {/* Avis clients */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Ce que disent nos clients</h3>
            <div className="flex items-center justify-center space-x-1 text-sky-600">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-slate-600 mt-2">Note moyenne 4.9/5</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50">
              <div className="flex items-center space-x-1 text-sky-600 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700">Réservation facile et rapide. Le QR code a été accepté sans problème à l’embarquement.</p>
              <p className="mt-3 text-sm text-slate-500">— Sarah K.</p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50">
              <div className="flex items-center space-x-1 text-sky-600 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700">Interface claire et moderne. J’ai trouvé mon trajet en quelques secondes.</p>
              <p className="mt-3 text-sm text-slate-500">— Daniel M.</p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50">
              <div className="flex items-center space-x-1 text-sky-600 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700">Service client réactif. Paiement sécurisé et confirmation instantanée.</p>
              <p className="mt-3 text-sm text-slate-500">— Patrick L.</p>
            </div>
          </div>
        </div>
      </section>
        {/* Bandeau de confiance */}
        <section className="bg-white/70 backdrop-blur border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2 text-slate-700">
              <ShieldCheck className="w-6 h-6 text-sky-600" />
              <span className="font-semibold">Paiements sécurisés</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">Support 7j/7</span>
            </div>
            <div className="flex items-center gap-6 opacity-90">
              <div className="text-slate-500 text-sm">TransCongo</div>
              <div className="text-slate-500 text-sm">ONATRA</div>
              <div className="text-slate-500 text-sm">Katanga Express</div>
              <div className="text-slate-500 text-sm">Transport Fluvial</div>
            </div>
          </div>
        </section>

        {/* Résultats de recherche */}
        <section id="results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {filteredTrips.length > 0 ? (
            <div>
              <div className="space-y-3 sm:space-y-4">
                {filteredTrips.map((trip: ImportedTrip) => (
                  <div key={trip.id} className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-slate-200 overflow-hidden">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: Route Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                            <div className="bg-gradient-to-br from-blue-700 to-blue-600 p-2 rounded-lg text-white">
                              <Ticket className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm sm:text-base">{trip.route?.operator?.name ?? ''}</h4>
                              <p className="text-xs sm:text-sm text-slate-600">{trip.route?.transport_type?.name ?? ''}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                            <div>
                              <p className="text-lg sm:text-2xl font-bold text-slate-900">{formatTime(trip.departure_time)}</p>
                              <p className="text-xs sm:text-sm text-slate-600">{trip.route?.departure_city ?? ''}</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                              <div className="flex items-center space-x-2 text-slate-400">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="flex-1 h-0.5 bg-slate-300"></div>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="flex-1 h-0.5 bg-slate-300"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {trip.route?.estimated_duration_minutes ? formatDuration(trip.route.estimated_duration_minutes) : ''}
                              </p>
                            </div>
                            <div>
                              <p className="text-lg sm:text-2xl font-bold text-slate-900">{formatTime(trip.arrival_time)}</p>
                              <p className="text-xs sm:text-sm text-slate-600">{trip.route?.arrival_city ?? ''}</p>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600">
                            <span className="flex items-center">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-700" />
                              {trip.available_seats} places disponibles
                            </span>
                            <span className="hidden sm:inline">Véhicule: {trip.vehicle_number}</span>
                          </div>
                        </div>
                        {/* Right: Price & Action */}
                        <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-center gap-3 sm:gap-4">
                          <div className="text-center sm:text-right">
                            <p className="text-xl sm:text-3xl font-bold text-slate-900">
                              {trip.route?.base_price ? trip.route.base_price.toLocaleString('fr-FR') : ''} FC
                            </p>
                            <p className="text-xs sm:text-sm text-slate-600">par personne</p>
                          </div>
                          {/* Réserver désactivé sur la page d'accueil */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  aria-label="Page précédente"
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                >
                  Précédent
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      setTimeout(() => {
                        window.location.hash = '#/login';
                      }, 100);
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Connexion
                  </button>
                )}
                {/* Inscription gérée par AuthButtons dans le header pour éviter les doublons */}
                <button
                  disabled={(typeof totalResults === 'number' ? (page * 10) >= totalResults : filteredTrips.length < 10) || loading}
                  onClick={() => setPage(p => p + 1)}
                  aria-label="Page suivante"
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg max-w-md mx-auto">
                <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                  Aucun trajet trouvé
                </h3>
                <p className="text-slate-600 text-sm sm:text-base">
                  Modifiez vos critères de recherche pour voir les trajets disponibles
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
      {/* Features Section */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Pourquoi choisir CongoMuv ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center rounded-2xl p-8 border border-slate-200 bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Réservation simple</h4>
              <p className="text-slate-600">Réservez vos billets en quelques clics, où que vous soyez</p>
            </div>
            <div className="text-center rounded-2xl p-8 border border-slate-200 bg-gradient-to-br from-white to-indigo-50 hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                <Ticket className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Billets électroniques</h4>
              <p className="text-slate-600">Recevez votre billet par email et SMS avec QR code sécurisé</p>
            </div>
            <div className="text-center rounded-2xl p-8 border border-slate-200 bg-gradient-to-br from-white to-cyan-50 hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-cyan-600 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Suivi en temps réel</h4>
              <p className="text-slate-600">Suivez votre voyage en direct avec notre système GPS</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            © 2025 CongoMuv E-Ticket. Tous droits réservés.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Contact: {' '}
            <a href="mailto:sumbaestime@gmail.com" className="text-blue-400 hover:text-blue-300">
              sumbaestime@gmail.com
            </a>
            {' '} | +243 821 938 773
          </p>
        </div>
      </footer>
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedTrip(null);
        }}
        trip={selectedTrip}
        onSuccess={() => {
          setShowBookingModal(false);
          setSelectedTrip(null);
        }}
      />
      <MyTripsModal
        isOpen={false}
        onClose={() => {}}
      />
    </div>
  );
}
