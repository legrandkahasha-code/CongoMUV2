import { useState, useEffect } from 'react';

// Supabase only: backend API removed

interface Incident {
  id: string;
  operator_id?: string;
  trip_id?: string;
  type: string;
  severity: string;
  status: string;
  description: string;
  date?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export const useIncidentsBackend = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth headers not needed for Supabase client

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with Supabase query
      // Example mock data
      const mockIncidents = [
        {
          id: '1',
          type: 'Retard',
          severity: 'mineur',
          status: 'résolu',
          description: 'Bus en retard de 10 min',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setIncidents(mockIncidents);
    } catch (err) {
      setError('Erreur chargement incidents');
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async (incidentData: Omit<Incident, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // TODO: Replace with Supabase insert
      // Example mock creation
      const newIncident = {
        ...incidentData,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setIncidents(prev => [...prev, newIncident]);
      return newIncident;
    } catch (err) {
      throw err;
    }
  };

  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    try {
      // TODO: Replace with Supabase update
      setIncidents(prev =>
        prev.map(incident =>
          incident.id === id ? { ...incident, ...updates, updated_at: new Date().toISOString() } : incident
        )
      );
      return updates;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return { 
    incidents, 
    loading, 
    error, 
    refresh: fetchIncidents,
    createIncident,
    updateIncident
  };
};

export default useIncidentsBackend;
