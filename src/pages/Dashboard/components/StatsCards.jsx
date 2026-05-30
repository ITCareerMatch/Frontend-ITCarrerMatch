/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiBriefcase, FiClock, FiTarget } from 'react-icons/fi';
import { BsPersonCheck, BsLightningChargeFill } from 'react-icons/bs';

/**
 * StatsCards Component - Dashboard overview stats
 */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function StatsCards({
  profileCompleteness,
  latestScore,
  jobCount,
  historyCount,
  jobsLoading,
  historyLoading,
  onNavigate
}) {
  const stats = [
    {
      label: 'Profil',
      value: `${profileCompleteness.score}%`,
      subtext: 'Kelengkapan Profil',
      icon: <BsPersonCheck size={20} />,
      color: 'blue',
      progress: profileCompleteness.score,
      onClick: () => onNavigate('/pengaturan')
    },
    {
      label: 'Skor',
      value: latestScore || '-',
      subtext: latestScore >= 80 ? 'Kompatibilitas Tinggi' : latestScore >= 60 ? 'Kompatibilitas Sedang' : latestScore > 0 ? 'Perlu Optimasi' : 'Belum Ada Analisis',
      icon: <FiActivity size={20} />,
      color: 'emerald',
      onClick: () => onNavigate('/riwayat')
    },
    {
      label: 'Lowongan',
      value: jobsLoading ? '-' : jobCount,
      subtext: 'Rekomendasi AI',
      icon: <FiBriefcase size={20} />,
      color: 'purple',
      onClick: () => onNavigate('/lowongan')
    },
    {
      label: 'Riwayat',
      value: historyLoading ? '-' : historyCount,
      subtext: 'Analisis Terakhir',
      icon: <FiClock size={20} />,
      color: 'amber',
      onClick: () => onNavigate('/riwayat')
    }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, idx) => {
        const colors = colorClasses[stat.color];
        return (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={stat.onClick}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">{stat.label}</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stat.value}
              {stat.label === 'Skor' && <span className="text-sm font-semibold text-slate-400">/100</span>}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">{stat.subtext}</div>
            {stat.label === 'Profil' && stat.progress > 0 && (
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}