import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import useAuth from '../../context/useAuth';

/**
 * Reusable Navbar Component
 * Supports multiple variants for different page contexts
 *
 * @param {string} variant - 'landing' | 'minimal' | 'transparent'
 * @param {string} activeItem - Currently active nav item
 */
export default function Navbar({ variant = 'landing', activeItem = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = !!session || !!localStorage.getItem('access_token');

  // Navigation items based on variant
  const getNavItems = () => {
    switch (variant) {
      case 'landing':
        return [
          { label: 'Beranda', path: '/' },
          { label: 'Daftar Lowongan', path: '/lowongan' },
          { label: 'Tentang Kami', path: '/tentang-kami' },
        ];
      case 'minimal':
        return [
          { label: 'Beranda', path: '/' },
          { label: 'Daftar Lowongan', path: '/lowongan' },
          { label: 'Tentang Kami', path: '/tentang-kami' },
        ];
      case 'transparent':
        return [
          { label: 'Beranda', path: '/' },
          { label: 'Daftar Lowongan', path: '/lowongan' },
          { label: 'Tentang Kami', path: '/tentang-kami' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll to section (for landing page with anchor links)
  const handleScrollTo = (e, path) => {
    if (path.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(path.substring(1));
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  // Check if nav item is active
  const isActive = (path) => {
    if (activeItem) return activeItem === path;
    return location.pathname === path;
  };

  // Get navbar style based on variant and scroll state
  const getNavbarStyle = () => {
    const base = 'flex justify-between items-center h-20 px-6 md:px-12 lg:px-16 fixed inset-x-0 top-0 z-50 transition-all duration-300';

    switch (variant) {
      case 'landing':
        return `${base} ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/60 shadow-md'
            : 'bg-white/40 backdrop-blur-sm border-b border-transparent'
        }`;
      case 'minimal':
        return `${base} ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm'
            : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
        }`;
      case 'transparent':
        return `${base} ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/60 shadow-md'
            : 'bg-transparent'
        }`;
      default:
        return `${base} bg-white/85 backdrop-blur-md border-b border-slate-200/60`;
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={getNavbarStyle()}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 font-bold text-xl text-slate-900 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
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

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          {navItems.map((item) => (
            <a
              key={item.path}
              onClick={(e) => {
                if (item.scroll) {
                  handleScrollTo(e, item.path);
                } else {
                  navigate(item.path);
                }
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer tracking-tight ${
                isActive(item.path)
                  ? 'text-blue-600 font-extrabold'
                  : ''
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-50 border border-slate-200 shadow-sm transition-all cursor-pointer hover:border-slate-300 active:scale-95"
            >
              Ke Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hover:text-blue-600 text-sm font-bold transition-colors cursor-pointer mr-2"
            >
              Masuk
            </button>
          )}
          <button
            onClick={() => navigate('/cek-skor')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:opacity-95 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
          >
            <BsStars /> Cek Skor CV
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed md:hidden inset-x-0 top-20 z-40 bg-white border-b border-slate-200/60 px-8 py-6 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-700">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  onClick={() => {
                    if (item.scroll) {
                      const element = document.getElementById(item.path.substring(1));
                      if (element) {
                        const offset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }
                    } else {
                      navigate(item.path);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`block pb-3 border-b border-slate-50 hover:text-blue-600 transition-colors cursor-pointer ${
                    isActive(item.path) ? 'text-blue-600' : ''
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-3 w-full">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full bg-slate-50 text-slate-700 px-4 py-3 rounded-xl border border-slate-200 transition-colors font-bold"
                  >
                    Ke Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-center text-slate-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-slate-200 font-bold"
                  >
                    Masuk
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/cek-skor');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 font-bold"
                >
                  <BsStars /> Cek Skor CV
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
