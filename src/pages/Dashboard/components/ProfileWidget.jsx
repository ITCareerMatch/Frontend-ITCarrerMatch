import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiTarget, FiChevronRight } from 'react-icons/fi';

/**
 * ProfileWidget Component - Profile completeness card
 */
export default function ProfileWidget({ profileCompleteness, onNavigate }) {
  const { score, items, completed, total } = profileCompleteness;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <FiTarget className="text-blue-500" /> Kelengkapan Profil
        </h3>
        <button
          onClick={onNavigate}
          className="text-xs font-bold text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-black text-slate-900">{score}%</span>
          <span className="text-xs text-slate-500">{completed}/{total} fields</span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Missing Items */}
        <div className="grid grid-cols-2 gap-2">
          {items.filter(i => !i.done).slice(0, 4).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
              {item.label}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {completed < total && (
          <button
            onClick={onNavigate}
            className="w-full mt-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            Lengkapi Profil
          </button>
        )}
      </div>
    </motion.div>
  );
}