import { useAuth } from '../lib/authContext';

export default function AuthButtons() {
  const { session, profile, signOut } = useAuth();

  // Afficher directement les boutons de connexion/inscription
  // Le chargement du profil se fera après la connexion
  if (!session) {
    return (
      <div className="flex items-center space-x-3">
        <button
          onClick={() => { window.location.hash = '#/login'; }}
          className="text-slate-700 hover:text-blue-600 font-medium transition text-sm"
        >
          Connexion
        </button>
        <button
          onClick={() => { window.location.hash = '#/signup'; }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
        >
          S'inscrire
        </button>
      </div>
    );
  }

  // Si l'utilisateur est connecté, afficher les options de compte
  return (
    <div className="flex items-center space-x-4">
      <span className="text-slate-700 text-sm hidden sm:inline">
        {profile?.name || 'Mon compte'}
      </span>
      <button 
        onClick={() => { window.location.hash = '/'; }} 
        className="text-slate-700 hover:text-blue-600 font-medium transition text-sm"
      >
        Tableau de bord
      </button>
      <button 
        onClick={signOut} 
        className="text-slate-700 hover:text-red-600 font-medium transition text-sm"
      >
        Déconnexion
      </button>
    </div>
  );
}
