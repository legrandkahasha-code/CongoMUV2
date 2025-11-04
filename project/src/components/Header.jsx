import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const { session, profile } = useAuth();
  const isAuthenticated = !!session;
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Déconnexion de Supabase
      await supabase.auth.signOut();
      
      // Effacer le stockage local et de session
      localStorage.clear();
      sessionStorage.clear();
      
      // Supprimer tous les cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      });
      
      // Rediriger vers la page d'accueil
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // En cas d'erreur, forcer quand même la redirection
      window.location.href = '/';
    }
  };

  // Ne pas afficher le header sur les pages d'administration et d'opérateur
  if (location.pathname.startsWith('/admin') || 
      location.pathname.startsWith('/operator') || 
      location.pathname.startsWith('/driver')) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">CongoMuv</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                to="/" 
                className={`${location.pathname === '/' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Accueil
              </Link>
              <Link 
                to="/search" 
                className={`${location.pathname === '/search' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Rechercher un trajet
              </Link>
              <Link 
                to="/about" 
                className={`${location.pathname === '/about' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                À propos
              </Link>
              <Link 
                to="/contact" 
                className={`${location.pathname === '/contact' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative ml-3">
                  <div className="flex items-center space-x-4">
                    <Link 
                      to="/dashboard" 
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Mon espace
                    </Link>
                    <Link
                      to="/user/security"
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sécurité du compte
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a 
                  href="#/login" 
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Connexion
                </a>
                <a 
                  href="#/signup" 
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Inscription
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
