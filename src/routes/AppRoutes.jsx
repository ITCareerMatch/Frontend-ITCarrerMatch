import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// 1. Lazy Loading Komponen (Code Splitting)
const LandingPage = lazy(() => import('../pages/LandingPage'));
const PreLoginFlow = lazy(() => import('../pages/PreLoginFlow'));
const AuthPage = lazy(() => import('../pages/Auth'));
const DashLayout = lazy(() => import('../layouts/DashLayout'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const JobDetail = lazy(() => import('../pages/JobDetail'));
const CvEditor = lazy(() => import('../pages/CvEditor'));
const JobList = lazy(() => import('../pages/JobList'));
const NewAnalysis = lazy(() => import('../pages/NewAnalysis'));
const AnalysisResult = lazy(() => import('../pages/AnalysisResult'));
const DashboardJobs = lazy(() => import('../pages/DashboardJobs'));

// 2. Komponen Loading (Fallback)
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg font-semibold text-blue-600">Loading...</div>
  </div>
);

// 3. Sistem Protected Route (Standar Keamanan Sederhana)
const ProtectedRoute = ({ children }) => {
  // TODO: Nanti ini diganti dengan pengecekan token/auth dari Context atau API yang sebenarnya
  const isAuthenticated = true; // Ubah ke 'true' untuk mencoba masuk ke dashboard

  if (!isAuthenticated) {
    // Jika belum login, lempar kembali ke halaman login
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 4. Konfigurasi Router Utama
const router = createBrowserRouter([
  // --- RUTE PUBLIK ---
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/lowongan',
    element: <JobList />,
  },
  {
    path: '/cek-skor',
    element: <PreLoginFlow />,
  },
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/register',
    element: <AuthPage />,
  },

  // --- RUTE PRIVAT (Wajib Login) ---
  {
    element: <DashLayout />, 
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'analisis-baru',
        element: (
          <ProtectedRoute>
            <NewAnalysis />
          </ProtectedRoute>
        ),
      },
      {
        path: 'hasil-analisis',
        element: (
          <ProtectedRoute>
            <AnalysisResult />
          </ProtectedRoute>
        ),
      },
      {
        path: 'daftar-lowongan',
        element: (
          <ProtectedRoute>
            <DashboardJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: 'detail',
        element: (
          <ProtectedRoute>
            <JobDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'editor',
        element: (
          <ProtectedRoute>
            <CvEditor />
          </ProtectedRoute>
        ),
      },
    ],
  },
  
  // --- RUTE ERROR (Halaman 404) ---
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">404 - Halaman Tidak Ditemukan</h1>
      </div>
    ),
  },
]);

// 5. Ekspor Provider
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}