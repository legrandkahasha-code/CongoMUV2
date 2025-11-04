import { useState, useEffect } from 'react';
import { Users, Calendar } from 'lucide-react';
import './reports-analytics.css';

interface RevenueData {
  period: string;
  revenue: number;
  trips: number;
  passengers: number;
}

interface LinePerformance {
  line_name: string;
  revenue: number;
  occupancy_rate: number;
  trips_count: number;
}

type Period = 'day' | 'week' | 'month' | 'year';

export function ReportsAnalytics() {
  const [period, setPeriod] = useState<Period>('month');
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [linePerformance, setLinePerformance] = useState<LinePerformance[]>([]);
  const [, setLoading] = useState(false);

  // Résumé des statistiques clés, données statiques pour l’exemple
  const [summary] = useState({
    totalRevenue: 48500000,
    averageOccupancy: 78,
    totalTrips: 156,
    totalPassengers: 1247,
    satisfactionRate: 4.5,
  });

  const periods: { value: Period; label: string }[] = [
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'year', label: 'Année' },
  ];

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Simulation de chargement de données
      setRevenueData([
        { period: 'Semaine 1', revenue: 12000000, trips: 38, passengers: 310 },
        { period: 'Semaine 2', revenue: 11500000, trips: 42, passengers: 295 },
        { period: 'Semaine 3', revenue: 13200000, trips: 40, passengers: 335 },
        { period: 'Semaine 4', revenue: 11800000, trips: 36, passengers: 307 },
      ]);

      setLinePerformance([
        { line_name: 'Kinshasa - Lubumbashi', revenue: 25000000, occupancy_rate: 85, trips_count: 45 },
        { line_name: 'Matadi - Kinshasa', revenue: 15000000, occupancy_rate: 72, trips_count: 65 },
        { line_name: 'Kinshasa - Kisangani', revenue: 8500000, occupancy_rate: 68, trips_count: 46 },
      ]);
    } catch (error) {
      console.error('Erreur chargement rapports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header et Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Statistiques & Rapports</h2>
          <p className="text-sm text-slate-600">Revenu par ligne, satisfaction client, ponctualité</p>
        </div>
        <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
          <span>📄</span>
          <span>Exporter PDF</span>
        </button>
      </div>

      {/* Sélecteur de période */}
      <div className="flex space-x-2">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === p.value
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Revenu Total', value: summary.totalRevenue.toLocaleString('fr-FR') + ' FC', icon: '💰', bg: 'bg-green-100', color: 'text-green-900' },
          { label: 'Taux Remplissage', value: summary.averageOccupancy + '%', icon: '📈', bg: 'bg-blue-100', color: 'text-blue-900' },
          { label: 'Trajets', value: summary.totalTrips.toString(), icon: <Calendar className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100', color: 'text-purple-900' },
          { label: 'Passagers', value: summary.totalPassengers.toString(), icon: <Users className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100', color: 'text-orange-900' },
          { label: 'Satisfaction', value: summary.satisfactionRate + '/5', icon: '⭐', bg: 'bg-yellow-100', color: 'text-yellow-900' },
        ].map(({ label, value, icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`${bg} p-2 rounded-lg`}>
                {typeof icon === 'string' ? <span className={`text-xl ${color}`}>{icon}</span> : icon}
              </div>
              <p className="text-sm text-slate-600">{label}</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Évolution du Revenu */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Évolution du Revenu</h3>
        <div className="space-y-3">
          {revenueData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-slate-600">{data.period}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">
                    {data.trips} trajets • {data.passengers} passagers
                  </span>
                  <span className="font-semibold text-slate-900">
                    {data.revenue.toLocaleString('fr-FR')} FC
                  </span>
                </div>
                <div className="revenue-container w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`revenue-bar h-full rounded-full w-${Math.min(100, Math.round((data.revenue / 15000000) * 100))}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance par Ligne */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Performance par Ligne</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Ligne</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Revenu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Trajets</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Taux Remplissage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {linePerformance.map((line, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{line.line_name}</td>
                  <td className="px-4 py-4 text-slate-900 font-semibold">{line.revenue.toLocaleString('fr-FR')} FC</td>
                  <td className="px-4 py-4 text-slate-600">{line.trips_count}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="occupancy-container">
                        <div
                          className={`occupancy-bar w-${Math.round(line.occupancy_rate / 10) * 10} ${
                            line.occupancy_rate >= 80
                              ? 'high'
                              : line.occupancy_rate >= 60
                              ? 'medium'
                              : 'low'
                          }`}
                        />
                      </div>
                      <span className="font-semibold text-slate-900">{line.occupancy_rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h4 className="font-bold text-emerald-900 mb-2">💡 Meilleure Performance</h4>
          <p className="text-emerald-800 text-sm">
            La ligne <strong>Kinshasa - Lubumbashi</strong> génère le plus de revenus avec un taux de remplissage de 85%.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h4 className="font-bold text-yellow-900 mb-2">⚠️ À Améliorer</h4>
          <p className="text-yellow-800 text-sm">
            La ligne <strong>Kinshasa - Kisangani</strong> a un taux de remplissage de 68%. Considérez des promotions.
          </p>
        </div>
      </div>
    </div>
  );
}
