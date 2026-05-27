import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import AuthProvider from '../context/AuthContext';
import About from '../pages/About';

// 1. Lazy Loading Komponen
const LandingPage = lazy(() => import('../pages/LandingPage'));
const PreLoginFlow = lazy(() => import('../pages/PreLoginFlow'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const DashLayout = lazy(() => import('../layouts/DashLayout'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const JobDetail = lazy(() => import('../pages/JobDetail'));
const CvEditor = lazy(() => import('../pages/CvEditor'));
const JobList = lazy(() => import('../pages/JobList'));
const NewAnalysis = lazy(() => import('../pages/NewAnalysis'));
const AnalysisResult = lazy(() => import('../pages/AnalysisResult'));
const DashboardJobs = lazy(() => import('../pages/DashboardJobs'));
const Settings = lazy(() => import('../pages/Settings'));

// 2. Komponen Loading
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
    <div className="text-sm font-semibold text-gray-500">Memuat halaman...</div>
  </div>
);

// 3. Routing Protections
const ProtectedRoute = ({ children }) => {
  const hasToken = !!localStorage.getItem('access_token');
  if (!hasToken) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const hasToken = !!localStorage.getItem('access_token');
  if (hasToken) return <Navigate to="/dashboard" replace />;
  return children;
};

// Layout Pembungkus Utama untuk menyuntikkan AuthProvider di level Router
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// 4. Konfigurasi Router (Dengan Rute Ganda JobDetail yang Stabil)
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/tentang-kami', element: <About /> },
      { path: '/lowongan', element: <JobList /> },
      { path: '/cek-skor', element: <PreLoginFlow /> },
      { path: '/analisis-result', element: <AnalysisResult /> },
      
      // 1. RUTE STANDALONE PUBLIK (Diakses dari JobList Tamu)
      { path: '/detail/:id', element: <JobDetail /> }, 

      { path: '/login', element: <PublicRoute><Login /></PublicRoute> },
      { path: '/register', element: <PublicRoute><Register /></PublicRoute> },
      {
        element: <DashLayout />,
        children: [
          { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
          { path: 'analisis-baru', element: <ProtectedRoute><NewAnalysis /></ProtectedRoute> },
          { path: 'daftar-lowongan', element: <ProtectedRoute><DashboardJobs /></ProtectedRoute> },
          
          // 2. RUTE DASBOR INTERNAL (Diakses dari Halaman Dasbor Pengguna)
          { path: 'dashboard/detail/:id', element: <ProtectedRoute><JobDetail /></ProtectedRoute> }, 
          
          { path: 'editor', element: <ProtectedRoute><CvEditor /></ProtectedRoute> },
          { path: 'pengaturan', element: <ProtectedRoute><Settings /></ProtectedRoute> },
        ],
      },
      {
        path: '*',
        element: (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
            <h1 className="text-6xl font-black text-gray-300 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
            <a href="/" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">Kembali ke Beranda</a>
          </div>
        ),
      },
    ]
  }
]);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}