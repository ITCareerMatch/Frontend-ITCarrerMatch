import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  FiHome, FiFileText, FiBriefcase, 
  FiSettings, FiLogOut, FiMenu, FiX, FiBell,
  FiPlusCircle, FiMail
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { supabase } from '../lib/supabase';
import { fetchUserProfile } from '../services/api';

export default function DashLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [userProfile, setUserProfile] = useState({
    name: 'Memuat...',
    email: '',
    initials: '..'
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Logika untuk menentukan judul halaman yang sedang dibuka
  const getPageTitle = () => {
    if (location.pathname.includes('/dashboard')) return 'Dashboard';
    if (location.pathname.includes('/editor')) return 'CV Editor';
    if (location.pathname.includes('/analisis-baru')) return 'Analisis Baru';
    if (location.pathname.includes('/daftar-lowongan')) return 'Daftar Lowongan';
    if (location.pathname.includes('/pengaturan')) return 'Pengaturan';
    return 'Dashboard';
  };

  // Menutup popover jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const data = await fetchUserProfile(token);
        const name = data?.name || data?.email?.split('@')[0] || 'Pengguna';
        setUserProfile({
          name: name,
          email: data?.email || '',
          initials: name.substring(0, 2).toUpperCase()
        });
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setUserProfile({ name: 'Pengguna', email: '', initials: 'U' });
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('access_token');
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/editor', label: 'CV Editor', icon: <FiFileText size={20} /> },
    { path: '/analisis-baru', label: 'Analisis Baru', icon: <FiPlusCircle size={20} /> },
    { path: '/daftar-lowongan', label: 'Daftar Lowongan', icon: <FiBriefcase size={20} /> },
  ];

  return (
    <div className="h-screen bg-gray-50 flex font-sans text-gray-800 overflow-hidden">
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-70 bg-white border-r border-gray-200 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="h-19 flex items-center px-6 border-b border-gray-100 justify-between">
          <div className="flex items-center gap-2 font-bold text-lg sm:text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
            <div>
              <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-15 h-15 object-contain" />
            </div>
            ITCareerMatch
          </div>
          <button className="lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}><FiX size={24} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu Utama</p>
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <div className={isActive ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</div>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1.5 bg-white shrink-0">
          <NavLink to="/pengaturan" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
            <FiSettings size={20} /> Pengaturan
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50">
            <FiLogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-19 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          
          {/* SISI KIRI: Judul Halaman yang sedang dibuka */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <h1 className="font-bold text-gray-900 text-lg sm:text-xl">
              {getPageTitle()}
            </h1>
          </div>

          {/* SISI KANAN: Notifikasi + Profil */}
          <div className="flex items-center gap-4 relative" ref={profileRef}>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <FiBell size={20} />
            </button>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-1 rounded-full border border-transparent hover:border-gray-200 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                {userProfile.initials}
              </div>
            </button>

            {/* Popover Profil */}
            {isProfileOpen && (
              <div className="absolute top-14 right-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-fadeIn">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                   <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{userProfile.initials}</div>
                   <div>
                     <p className="font-bold text-sm text-gray-900">{userProfile.name}</p>
                     <p className="text-[10px] text-gray-400 flex items-center gap-1"><FiMail size={10}/> {userProfile.email}</p>
                   </div>
                </div>
                <button onClick={() => { navigate('/pengaturan'); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 font-medium">
                  <FiSettings size={16}/> Pengaturan Akun
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 hover:bg-red-50 rounded-lg text-sm text-red-600 font-medium mt-1">
                  <FiLogOut size={16}/> Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}