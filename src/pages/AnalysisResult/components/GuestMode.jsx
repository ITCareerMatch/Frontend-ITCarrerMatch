import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiLock, FiCheckCircle, FiBriefcase, FiArrowLeft, FiLogIn, FiStar, FiZap, FiTarget
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

/**
 * GuestMode Component (Locked)
 * Displays locked preview UI for guest users
 * User must login/register to unlock and see actual analysis results
 */
export default function GuestMode({ onLoginClick, onBack }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={onBack || (() => navigate('/'))}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
          >
            <FiArrowLeft size={18} /> Beranda
          </motion.button>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-slate-500 hidden sm:block">Sudah punya akun?</span>
            <button
              onClick={onLoginClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer"
            >
              Masuk
            </button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          {/* Lock Icon with Pulse */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-slate-700 relative"
          >
            <FiLock className="text-white" size={32} />
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 bg-blue-500/40 rounded-2xl"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight"
          >
            Analisis CV Selesai!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 mb-6 max-w-md mx-auto leading-relaxed"
          >
            CV Anda sudah berhasil dianalisis. Masuk untuk melihat hasil lengkap dan rekomendasi pekerjaan.
          </motion.p>

          {/* Locked Stats Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/95 backdrop-blur-md" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FiCheckCircle size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-bold uppercase">Skill Match</div>
                  <div className="text-lg font-black text-slate-900">?</div>
                </div>
                <FiLock size={14} className="text-slate-300 ml-2" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/95 backdrop-blur-md" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                  <FiTarget size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-bold uppercase">Skill Gap</div>
                  <div className="text-lg font-black text-slate-900">?</div>
                </div>
                <FiLock size={14} className="text-slate-300 ml-2" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/95 backdrop-blur-md" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <FiBriefcase size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-bold uppercase">Rekomendasi</div>
                  <div className="text-lg font-black text-slate-900">20+</div>
                </div>
                <FiLock size={14} className="text-slate-300 ml-2" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30"
            >
              <BsStars size={28} className="text-white" />
            </motion.div>

            <h3 className="text-2xl font-extrabold text-center mb-3">
              Buka Potensi Penuh CV Anda
            </h3>
            <p className="text-slate-300 text-center mb-8 max-w-md mx-auto">
              Daftar gratis sekarang dan dapatkan analisis lengkap, skill match, AI insight, serta 20 rekomendasi pekerjaan teratas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                onClick={onLoginClick}
                className="flex-1 bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg"
              >
                <FiLogIn size={20} />
                Masuk / Daftar
              </button>
            </div>

            {/* trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <FiCheckCircle size={14} className="text-emerald-400" /> 100% Gratis
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheckCircle size={14} className="text-emerald-400" /> Tanpa Kartu Kredit
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheckCircle size={14} className="text-emerald-400" /> Data Aman
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
