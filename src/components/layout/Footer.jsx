import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiBriefcase, FiUsers, FiMail, FiPhone, FiGithub } from 'react-icons/fi';

/**
 * Reusable Footer Component
 *
 * @param {string} variant - 'full' | 'minimal'
 * @param {boolean} showContact - Show contact section (default: true for full variant)
 */
export default function Footer({ variant = 'minimal', showContact = true }) {
  const navigate = useNavigate();

  // Quick links config
  const quickLinks = [
    { label: 'Beranda', icon: <FiHome size={14} />, action: () => navigate('/') },
    { label: 'Daftar Lowongan', icon: <FiBriefcase size={14} />, action: () => navigate('/lowongan') },
    { label: 'Tentang Kami', icon: <FiUsers size={14} />, action: () => navigate('/tentang-kami') },
  ];

  // Contact info
  const contactInfo = [
    { label: 'itcareermatch.com', icon: '@', href: 'https://github.com/ITCareerMatch' },
    { label: 'itcareermatch@dicoding.com', icon: <FiMail size={14} />, href: 'mailto:itcareermatch@dicoding.com' },
    { label: '+62 822-1098-0898', icon: <FiPhone size={14} />, href: 'tel:+6282210980898' },
  ];

  // Minimal variant (About page style)
  if (variant === 'minimal') {
    return (
      <footer className="py-8 bg-slate-50 border-t border-slate-100 text-center">
        <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          &copy; 2026 ITCareerMatch. Capstone Team - CC26-PSU088.
        </div>
      </footer>
    );
  }

  // Full variant (LandingPage style)
  return (
    <footer className="bg-white text-slate-600 pt-20 pb-8 px-6 md:px-12 lg:px-16 border-t border-slate-200/60 relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 relative z-10 text-left">

        {/* Column 1: Brand & Description */}
        <div className="space-y-6">
          <div
            className="flex items-center gap-3 font-bold text-xl text-slate-900 mb-4 cursor-pointer group w-max"
            onClick={() => navigate('/')}
          >
            <img
              src="/images/logo-itcareermatch.png"
              alt="ITCareerMatch Logo"
              className="w-12 h-12 object-contain rounded-2xl transition-transform duration-500 group-hover:rotate-6"
            />
            <span className="bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent font-extrabold tracking-tight">
              ITCareerMatch
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
            Platform analisis CV berbasis AI untuk membantu kamu memetakan celah kompetensi dan menemukan peluang kerja yang tepat.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6">
          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-4">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={link.action}
                  className="flex items-center gap-2.5 text-slate-500 text-sm font-semibold hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {link.icon}
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact */}
        {showContact && (
          <div className="space-y-6">
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-4">
              {contactInfo.map((contact, idx) => (
                <li key={idx}>
                  <a
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-2.5 text-slate-500 text-sm font-semibold hover:text-blue-600 transition-colors"
                  >
                    {typeof contact.icon === 'string' ? (
                      <span className="w-6 h-6 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center text-xs font-bold">{contact.icon}</span>
                    ) : (
                      contact.icon
                    )}
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Copyright */}
      <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        &copy; 2026 ITCareerMatch. Capstone Team - CC26-PSU088.
      </div>
    </footer>
  );
}