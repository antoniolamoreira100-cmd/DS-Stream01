import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

export function ProtectedRoute({ children, requireProfile = false }: ProtectedRouteProps) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const activeProfile = useAppStore((s) => s.activeProfile);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireProfile && !activeProfile) {
    return <Navigate to="/select-profile" replace />;
  }

  return <>{children}</>;
}
