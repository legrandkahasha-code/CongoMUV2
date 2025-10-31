import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { getDashboardByRole, checkPermission as verifyPermission } from '../../utils/roleUtils';

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  roles, 
  requiredPermission,
  redirectTo,
  ...rest 
}) => {
  const { 
    session,
    profile,
    loading: isLoading,
    hasRole,
  } = useAuth();
  const isAuthenticated = !!session;
  const user = profile ? { role: profile.role } : null;
  
  const location = useLocation();
  const navigate = useNavigate();

  // Rediriger vers le tableau de bord approprié si l'utilisateur est connecté
  // mais qu'il tente d'accéder à la page de connexion
  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
      const dashboard = getDashboardByRole(user?.role);
      navigate(dashboard.path, { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate, user?.role]);

  // Afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles requis
  const rolesOk = Array.isArray(roles) && roles.length > 0 ? roles.some(r => hasRole(r)) : (requiredRole ? hasRole(requiredRole) : true);
  if (!rolesOk) {
    // Si une redirection personnalisée est spécifiée, l'utiliser
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    
    // Sinon, rediriger vers le tableau de bord approprié ou la page non autorisée
    const dashboard = getDashboardByRole(user?.role);
    return <Navigate to={dashboard.path} replace />;
  }

  // Vérifier les permissions requises
  if (requiredPermission && !(user?.role && verifyPermission(user.role, requiredPermission))) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Si tout est bon, afficher les enfants
  return children;
};

export default ProtectedRoute;
