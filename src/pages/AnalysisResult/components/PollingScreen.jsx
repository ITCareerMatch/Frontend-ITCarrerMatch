import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

// Polling steps for animation
const POLLING_STEPS = [
  'CV diterima & divalidasi server',
  'Parsing & ekstraksi teks CV...',
  'AI menganalisis keahlian & kompetensi...',
  'Mencocokkan dengan lowongan kerja...',
  'Menyusun hasil rekomendasi akhir...',
];

/**
 * PollingScreen Component
 * Displays animated polling steps while waiting for CV analysis to complete
 */
export default function PollingScreen({ currentStep, isAuthenticated, isClaiming }) {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-slate-800"
      >
        <BsStars className="text-amber-400 animate-pulse" size={32} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight"
      >
        {isClaiming ? 'MengKlaim Sesi Analisis' : isAuthenticated ? 'Memproses Analisis CV Anda' : 'Menyimpan Preview'}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-slate-500 mb-12 text-center max-w-xs"
      >
        {isClaiming ? 'Menunggu server memproses sesi Anda...' : isAuthenticated ? 'Klaim sesi dan proses analisis...' : 'Mohon tunggu sebentar...'}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm space-y-3 mb-12"
      >
        {POLLING_STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-500 ${
                done
                  ? 'bg-emerald-50 border-emerald-100'
                  : active
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black ${
                done
                  ? 'bg-emerald-500 text-white'
                  : active
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-400'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-semibold ${
                done
                  ? 'text-emerald-700'
                  : active
                  ? 'text-blue-700'
                  : 'text-slate-400'
              }`}>
                {step}
              </span>
              {active && (
                <FiRefreshCw className="text-blue-500 animate-spin ml-auto" size={14} />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-[11px] font-bold text-slate-400 uppercase tracking-widest"
      >
        Mohon tunggu...
      </motion.p>
    </div>
  );
}
