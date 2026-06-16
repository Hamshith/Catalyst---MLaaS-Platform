import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider } from './features/auth/AuthContext';
import { ThemeProvider } from './components/layout/ThemeProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/DashboardPage';
import CreateTrainingPage from './pages/CreateTrainingPage';
import RequestsPage from './pages/RequestsPage';
import RequestDetailPage from './pages/RequestDetailPage';
import CreditsPage from './pages/CreditsPage';

import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Protected routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/training/new" element={<CreateTrainingPage />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/requests/:id" element={<RequestDetailPage />} />
                <Route path="/credits" element={<CreditsPage />} />
                <Route path="/change-password" element={<ChangePasswordPage />} />
              </Route>
            </Routes>
          </BrowserRouter>

          <Toaster
            position="top-right"
            containerStyle={{ top: 20, right: 20 }}
            toastOptions={{ duration: 4000 }}
          >
            {(t) => {
              const isSuccess = t.type === 'success';
              const isError = t.type === 'error';
              const accentColor = isSuccess
                ? '#22c55e'
                : isError
                  ? '#ef4444'
                  : '#6366f1';
              const bgClass = isSuccess
                ? 'bg-success/5 border-success/30'
                : isError
                  ? 'bg-danger/5 border-danger/30'
                  : 'bg-info/5 border-info/30';
              const IconComp = isSuccess
                ? CheckCircle2
                : isError
                  ? XCircle
                  : Info;

              return (
                <div
                  className={`flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl
                    bg-white dark:bg-dark-card ${bgClass}
                    animate-slide-up max-w-sm w-full`}
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: accentColor,
                    opacity: t.visible ? 1 : 0,
                    transition: 'opacity 200ms ease-in-out',
                  }}
                >
                  <IconComp
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: accentColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5"
                      style={{ color: accentColor }}>
                      {isSuccess ? 'Success' : isError ? 'Error' : 'Info'}
                    </p>
                    <p className="text-sm text-dark/80 dark:text-surface-light/80 break-words">
                      {t.message}
                    </p>
                  </div>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-dark/40 dark:text-surface-light/40" />
                  </button>
                </div>
              );
            }}
          </Toaster>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
