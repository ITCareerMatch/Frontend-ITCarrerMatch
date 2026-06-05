/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiFileText, FiClock } from 'react-icons/fi';
import { BsPersonCheck } from 'react-icons/bs';

/**
 * CV List Item - compact card untuk StatsCards
 */
function CvListItem({ cv }) {
  // Konversi UTC ke jam lokal
  const formatRelative = (utcStr) => {
    if (!utcStr) return '';
    const utc = new Date(utcStr);
    const now = new Date();
    const diffHours = Math.abs(now - utc) / 3_600_000; // ms → jam

    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return 'Hari ini';
    if (diffHours < 48) return 'Kemarin';
    if (diffHours < 168) return `${Math.floor(diffHours / 24)} hari lalu`;
    return utc.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const getBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded">
          Selesai
        </span>
      );
    }
    if (status === 'processing') {
      return (
        <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 font-bold rounded">
        Diproses
      </span>
      );
    }
    return (
      <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
        Draft
      </span>
    );
  };

  return (
    <div className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 last:border-0">
      {/* File icon */}
      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
        <FiFileText size={13} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-700 truncate leading-tight">
          {cv.file_name || 'CV Document'}
        </p>
        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
          <FiClock size={9} />
          {formatRelative(cv.uploaded_at)}
        </p>
      </div>

      {/* Badge */}
      {getBadge(cv.status)}
    </div>
  );
}

/**
 * StatsCards - 3 card ringkasan dashboard
 */
const fade = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function StatsCards({ profileCompleteness, jobCount, archives, onNavigate }) {
  // Sort archives DESC uploaded_at, ambil 2 terbaru
  const sorted = [...(archives || [])].sort(
    (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
  );
  const top2 = sorted.slice(0, 2);

  const cards = [
    {
      label: 'Profil',
      value: `${profileCompleteness.score}%`,
      sub: 'Kelengkapan Profil',
      description: 'Pastikan profil Anda lengkap untuk hasil optimal',
      icon: <BsPersonCheck size={18} />,
      accent: 'blue',
      progress: profileCompleteness.score,
      onClick: () => onNavigate('/pengaturan'),
    },
    {
      label: 'Lowongan',
      value: jobCount,
      sub: 'Rekomendasi AI',
      description: 'Jelajahi lowongan yang cocok dengan skill Anda',
      icon: <FiBriefcase size={18} />,
      accent: 'purple',
    },
    {
      label: 'Arsip CV',
      icon: <FiFileText size={18} />,
      accent: 'amber',
      onClick: () => onNavigate('/riwayat?tab=archives'),
    },
  ];

  const accentMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
      {cards.map((card) => {
        const c = accentMap[card.accent];
        return (
          <motion.div
            key={card.label}
            variants={stagger}
            initial="hidden"
            animate="visible"
            onClick={card.onClick}
            className={`
              relative bg-white rounded-2xl border ${c.border} p-4
              cursor-pointer select-none active:scale-95 transition-transform
              flex flex-col gap-2
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 ${c.bg} ${c.text} rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                {card.label}
              </span>
            </div>

            {/* Angka */}
            <div>
              <p className="text-xl font-extrabold text-slate-900 leading-none">
                {card.value}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{card.sub}</p>
              {card.description && (
                <p className="text-[16px] text-slate-400 mt-4 leading-tight">
                  {card.description}
                </p>
              )}
            </div>

            {/* Progress profil */}
            {card.label === 'Profil' && card.progress > 0 && (
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-auto">
                <motion.div
                  variants={fade}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            )}

            {/* Progress rekomendasi */}
            {card.label === 'Lowongan' && card.value > 0 && (
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-auto">
                <motion.div
                  variants={fade}
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {/* List CV */}
            {card.label === 'Arsip CV' && (
              <div className="mt-1">
                {top2.length > 0 ? (
                  <div className="border-t border-slate-100 pt-2 space-y-0">
                    {top2.map((cv) => (
                      <CvListItem key={cv.id} cv={cv} />
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic leading-relaxed">
                    Belum ada CV
                  </p>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
