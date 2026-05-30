import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget } from 'react-icons/fi';

/**
 * FailedScreen Component
 * Displays error message when CV analysis fails
 */
export default function FailedScreen({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6 border border-rose-100"
      >
        <FiTarget size={28} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-extrabold text-slate-900 mb-2"
      >
        Analisis Gagal
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-slate-500 mb-10 text-center max-w-xs"
      >
        {error || 'Gagal memproses analisis'}
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onRetry}
        className="bg-slate-900 text-white font-bold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer shadow-lg"
      >
        Coba Lagi
      </motion.button>
    </div>
  );
}
