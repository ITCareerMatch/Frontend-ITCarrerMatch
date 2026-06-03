import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  FiHome, FiFileText, FiBriefcase,
  FiSettings, FiLogOut, FiMenu, FiX, FiBell,
  FiPlusCircle, FiMail, FiClock
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
    initials: '..',
    avatar_url: ''
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Logika untuk menentukan judul halaman yang sedang dibuka
  const getPageTitle = () => {
    if (location.pathname.includes('/detail')) return 'Detail Lowongan';
    if (location.pathname.includes('/dashboard')) return 'Dashboard';
    if (location.pathname.includes('/editor')) return 'CV Editor';
    if (location.pathname.includes('/analisis-baru')) return 'Analisis Baru';
    if (location.pathname.includes('/riwayat')) return 'Riwayat Analisis';
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
          initials: name.substring(0, 2).toUpperCase(),
          avatar_url: data?.avatar_url || ''
        });
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setUserProfile({ name: 'Pengguna', email: '', initials: 'U', avatar_url: '' });
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('access_token');
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Close sidebar when navigation changes (mobile responsive)
  // Using requestAnimationFrame to batch state updates and avoid cascading renders
  useEffect(() => {
    const handleNavigation = () => {
      requestAnimationFrame(() => {
        setIsSidebarOpen(false);
      });
    };
    handleNavigation();
  }, [location.pathname]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={18} /> },
    { path: '/editor', label: 'CV Editor', icon: <FiFileText size={18} /> },
    { path: '/analisis-baru', label: 'Analisis Baru', icon: <FiPlusCircle size={18} /> },
    { path: '/riwayat', label: 'Riwayat Analisis', icon: <FiClock size={18} /> },
    { path: '/daftar-lowongan', label: 'Daftar Lowongan', icon: <FiBriefcase size={18} /> },
  ];

  return (
    <div className="h-screen bg-slate-50/50 flex font-sans text-slate-800 overflow-hidden relative selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* Sidebar Overlay dengan backdrop blur */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Vercel / Linear inspired minimalistic approach */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 transform transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-xl lg:shadow-none`}>
        <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between shrink-0">
          <div 
            className="flex items-center gap-3 font-bold text-lg text-slate-900 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
              <img 
                src="/images/logo-itcareermatch.png" 
                alt="ITCareerMatch Logo" 
                className="w-11 h-11 object-contain relative rounded-2xl transition-transform duration-500 group-hover:rotate-6" 
              />
            </div>
            <span className="bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent font-extrabold tracking-tight">
              ITCareerMatch
            </span>
          </div>
          <button 
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Utama</p>
          {navItems.map((item) => {
            
            // --- LOGIKA DETERMINISTIK MENENTUKAN MENU AKTIF ---
            let isActive = false;
            if (location.pathname.includes('/detail/')) {
              // Jika sedang berada di rincian lowongan, alihkan sorotan ke menu "Daftar Lowongan"
              isActive = item.path === '/daftar-lowongan';
            } else {
              // Jika di halaman biasa, gunakan pencocokan standar
              isActive = location.pathname.includes(item.path);
            }

            return (
              <button 
                key={item.path} 
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 relative group cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50/10 text-blue-600 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.08)]' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full" />
                )}
                <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {item.icon}
                </div>
                <span className="tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1.5 bg-white shrink-0">
          <NavLink 
            to="/pengaturan" 
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              isActive 
                ? 'bg-slate-100 text-slate-900 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FiSettings size={18} className="text-slate-400" /> 
            <span className="tracking-tight">Pengaturan</span>
          </NavLink>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50/70 transition-all duration-300 group"
          >
            <FiLogOut size={18} className="text-rose-400 group-hover:text-rose-600 transition-colors" /> 
            <span className="tracking-tight">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header dengan efek Glassmorphism */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-6 sm:px-8 shrink-0 sticky top-0 z-30">
          
          {/* SISI KIRI: Judul Halaman yang sedang dibuka */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-all" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
          </div>

          {/* SISI KANAN: Notifikasi + Profil */}
          <div className="flex items-center gap-4 relative" ref={profileRef}>            
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-full border border-slate-200/50 hover:border-slate-300 transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs overflow-hidden shadow-inner ring-2 ring-transparent hover:ring-blue-100 transition-all">
                {userProfile.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="font-extrabold tracking-tight">{userProfile.initials}</span>
                )}
              </div>
            </button>

            {/* Popover Profil Premium */}
            {isProfileOpen && (
              <div className="absolute top-16 right-0 w-68 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 p-4 z-50 animate-fadeIn origin-top-right">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                   <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-md overflow-hidden shrink-0">
                     {userProfile.avatar_url ? (
                       <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                       <span className="font-extrabold tracking-tight">{userProfile.initials}</span>
                     )}
                   </div>
                   <div className="min-w-0">
                     <p className="font-bold text-sm text-slate-900 truncate capitalize leading-tight">{userProfile.name}</p>
                     <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate font-medium">
                       <FiMail size={12} className="shrink-0" /> {userProfile.email}
                     </p>
                   </div>
                </div>
                <button 
                  onClick={() => { navigate('/pengaturan'); setIsProfileOpen(false); }} 
                  className="w-full flex items-center gap-2.5 p-2 hover:bg-slate-50 rounded-xl text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors duration-200"
                >
                  <FiSettings size={15} className="text-slate-400" /> 
                  <span>Pengaturan Akun</span>
                </button>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-2.5 p-2 hover:bg-rose-50 rounded-xl text-sm text-rose-600 hover:text-rose-700 font-semibold transition-colors duration-200 mt-1"
                >
                  <FiLogOut size={15} className="text-rose-400" /> 
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Workspace utama dengan latar belakang minimalis dan dekorasi blur halus */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50/50 relative">
          <div className="absolute -top-40 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
          
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
      
      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(-8px) scale(0.98); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        .animate-fadeIn { animation: fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}