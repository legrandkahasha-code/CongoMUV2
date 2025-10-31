import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '../components/ui/use-toast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Configuration d'Axios pour inclure le token dans les requêtes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      // TODO: Replace with Supabase session check
      // Example mock logic
      setUser({ email: 'mock@congomuv.cd', first_name: 'MockUser' });
      setIsLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    // TODO: Replace with Supabase signIn
    // Example mock logic
    setToken('MOCK_TOKEN');
    const userData = { email, first_name: 'MockUser' };
    setUser(userData);
    toast({
      title: 'Connexion réussie',
      description: `Bienvenue, ${userData.first_name || userData.email}!`,
    });
    return userData;
  };

  const signup = async (userData) => {
    // TODO: Replace with Supabase signUp
    // Example mock logic
    setToken('MOCK_TOKEN');
    setUser(userData);
    toast({
      title: 'Inscription réussie',
      description: 'Votre compte a été créé avec succès!',
    });
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
    
    toast({
      title: 'Déconnexion réussie',
      description: 'Vous avez été déconnecté avec succès.',
    });
  };

  const updateProfile = async (userData) => {
    // TODO: Replace with Supabase update
    // Example mock logic
    setUser(userData);
    toast({
      title: 'Profil mis à jour',
      description: 'Vos informations ont été mises à jour avec succès.',
    });
    return userData;
  };

  const resetPassword = async (email) => {
    // TODO: Replace with Supabase password reset
    // Example mock logic
    toast({
      title: 'Email envoyé',
      description: 'Un email de réinitialisation a été envoyé à votre adresse.',
    });
    return true;
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export default AuthContext;
