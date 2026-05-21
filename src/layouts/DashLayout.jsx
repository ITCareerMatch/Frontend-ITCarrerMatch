import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  FiHome, FiFileText, FiBriefcase, 
  FiSettings, FiLogOut, FiMenu, FiX, FiBell,
  FiPlusCircle, FiUser, FiMail
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { supabase } from '../lib/supabase';
import { fetchUserProfile } from '../services/api';

export default function DashLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State Popover
  const profileRef = useRef(null); // Ref untuk klik di luar

  const [userProfile, setUserProfile] = useState({
    name: 'Memuat...',
    email: '',
    initials: '..'
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Menutup popover jika klik di luar elemen
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

  return (
    <div className="h-screen bg-gray-50 flex font-sans text-gray-800 overflow-hidden">
      {/* ... (Sidebar tetap sama seperti sebelumnya) ... */}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <h1 className="font-bold text-gray-900 text-lg hidden sm:block">
              {/* ... navItems logic ... */}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 relative" ref={profileRef}>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><FiBell size={20} /></button>
            <div className="h-6 w-px bg-gray-200"></div>
            
            {/* Tombol Profil yang mengontrol Popover */}
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">{userProfile.initials}</div>
            </button>

            {/* POPOVER DETAIL AKUN */}
            {isProfileOpen && (
              <div className="absolute top-14 right-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-fadeIn z-50">
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-50"><Outlet /></main>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}