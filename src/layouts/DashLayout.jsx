import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, FiFileText, FiBriefcase, FiMessageSquare, 
  FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiUser,
  FiPlusCircle
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

export default function DashLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Menu Navigasi Sidebar
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/editor', label: 'CV Editor', icon: <FiFileText size={20} /> },
    { path: '/analisis-baru', label: 'Analisis Baru', icon: <FiPlusCircle size={20} /> },
    { path: '/daftar-lowongan', label: 'Daftar Lowongan', icon: <FiBriefcase size={20} /> },
  ];

  const handleLogout = () => {
    // Simulasi Logout
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      
      {/* --- SIDEBAR (Desktop) & OVERLAY (Mobile) --- */}
      {/* Overlay hitam transparan saat sidebar terbuka di HP */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header Sidebar (Logo) */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0 justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-900 cursor-pointer" onClick={() => navigate('/#')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><BsStars size={16} /></div>
            ITCareerMatch
          </div>
          <button className="lg:hidden text-gray-500 hover:text-gray-900" onClick={() => setIsSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu Utama</p>
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className={isActive ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</div>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer Sidebar (User & Settings) */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium transition-colors mb-1">
            <div className="text-gray-400"><FiSettings size={20} /></div> Pengaturan
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors">
            <div className="text-red-500"><FiLogOut size={20} /></div> Keluar
          </button>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar / Header Atas */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Tombol Hamburger (Mobile) */}
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={24} />
            </button>
            <h1 className="font-bold text-gray-900 text-lg hidden sm:block">
              {navItems.find(item => location.pathname.includes(item.path))?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Notifikasi */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <FiBell size={20} />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            {/* Profil User */}
            <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                BS
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-900 leading-tight">Budi Santoso</p>
                <p className="text-xs text-gray-500 leading-tight">Free Plan</p>
              </div>
            </button>
          </div>
        </header>

        {/* Area Render Halaman Dinamis (Outlet) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-50">
          <Outlet /> {/* <-- Di sinilah halaman Dashboard/JobDetail akan muncul */}
        </main>
      </div>

    </div>
  );
}