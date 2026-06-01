import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AuthPage } from './pages/AuthPage';
import { SelectProfilePage } from './pages/SelectProfilePage';
import { HomePage } from './pages/HomePage';
import { DetailsPage } from './pages/DetailsPage';
import { PlayerPage } from './pages/PlayerPage';
import { SearchPage } from './pages/SearchPage';
import { MyListPage } from './pages/MyListPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/ui/Toast';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const activeProfile = useAppStore((s) => s.activeProfile);
  const login = useAppStore((s) => s.login);
  const clearAuth = useAppStore((s) => s.clearAuth);
  const loadUserProfiles = useAppStore((s) => s.loadUserProfiles);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log('Supabase getUser:', { data, error });

      if (data?.user) {
        const authUser = data.user;
        const user = {
          id: authUser.id,
          email: authUser.email ?? '',
          nome: (authUser.user_metadata as Record<string, unknown>)?.nome as string || authUser.email || 'Usuário',
        };

        login(user);
        await loadUserProfiles(user.id);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Supabase auth state changed:', { event: _event, session });

      if (session?.user) {
        const authUser = session.user;
        const user = {
          id: authUser.id,
          email: authUser.email ?? '',
          nome: (authUser.user_metadata as Record<string, unknown>)?.nome as string || authUser.email || 'Usuário',
        };
        login(user);
        await loadUserProfiles(user.id);
      } else {
        clearAuth();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [login, loadUserProfiles]);

  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to={activeProfile ? '/home' : '/select-profile'} replace />
              : <AuthPage />
          }
        />

        {/* Auth required */}
        <Route
          path="/select-profile"
          element={
            <ProtectedRoute>
              <SelectProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Profile required */}
        <Route
          path="/home"
          element={
            <ProtectedRoute requireProfile>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute requireProfile>
              <DetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:id"
          element={
            <ProtectedRoute requireProfile>
              <PlayerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute requireProfile>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-list"
          element={
            <ProtectedRoute requireProfile>
              <MyListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requireProfile>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <SelectProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
