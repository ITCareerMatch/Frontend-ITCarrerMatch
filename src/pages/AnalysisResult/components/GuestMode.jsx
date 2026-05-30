import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiLock, FiCheckCircle, FiXCircle, FiTrendingUp,
  FiBriefcase, FiArrowLeft, FiLogIn, FiStar, FiZap
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

/**
 * Animated Circular Score Ring Component
 * Animated SVG circle that fills based on score percentage
 */
function AnimatedScoreRing({ score, size = 200, strokeWidth = 12 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animate score from 0 to target
  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [score]);

  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Color based on score
  const getScoreColor = (s) => {
    if (s >= 80) return { stroke: '#10b981', text: 'emerald' };
    if (s >= 60) return { stroke: '#f59e0b', text: 'amber' };
    return { stroke: '#f43f5e', text: 'rose' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Glow effect for high scores */}
        {score >= 80 && (
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference, opacity: 0.5 }}
            animate={{ strokeDashoffset, opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], opacity: { duration: 1.5, repeat: Infinity } }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="text-center"
        >
          <motion.span
            key={animatedScore}
            className={`text-5xl font-black text-slate-900`}
          >
            {animatedScore}
          </motion.span>
          <span className="text-lg font-bold text-slate-400">%</span>
          <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
            colors.text === 'emerald' ? 'text-emerald-500' :
            colors.text === 'amber' ? 'text-amber-500' : 'text-rose-500'
          }`}>
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Blurred Content Card Component
 */
function BlurredCard({ icon, title, count, delay, colorClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm relative overflow-hidden"
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/90 backdrop-blur-md" />

      <div className="relative flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-bold text-slate-900 text-sm mb-0.5">{title}</div>
          <div className="text-xs text-slate-400">{count}</div>
        </div>
        <FiLock size={14} className="text-slate-300" />
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: 'spring' }}
          className="w-12 h-12 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <FiLock className="text-white" size={20} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * GuestMode Component (Locked)
 * Displays preview results for guest users with locked features
 * User must login/register to unlock full analysis
 */
// eslint-disable-next-line no-unused-vars
export default function GuestMode({ previewData, onLoginClick, onRegisterClick }) {
  const navigate = useNavigate();
  const score = previewData?.score ?? 0;
  const extractedSkills = previewData?.extracted_skills ?? [];
  const skillGap = previewData?.skill_gap ?? [];
  const aiInsight = previewData?.ai_insight ?? [];
  const summary = previewData?.summary ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/')}
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
        {/* Hero Score Section */}
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
            Hasil Analisis CV
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed"
          >
            Ini preview skor CV Anda. Masuk untuk melihat detail lengkap dan rekomendasi pekerjaan.
          </motion.p>

          {/* Animated Score Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
            className="inline-block"
          >
            <AnimatedScoreRing score={score} size={220} strokeWidth={14} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-sm text-slate-500"
          >
            <FiZap className="inline mr-1 text-amber-500" />
            Skor ini menunjukkan kecocokan CV Anda dengan standar industri IT
          </motion.p>
        </motion.div>

        {/* Locked Content Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FiStar className="text-amber-500" />
            Fitur Premium (Dikunci)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BlurredCard
              icon={<FiCheckCircle size={20} />}
              title="Skill Match"
              count={`${extractedSkills.length} skill teridentifikasi`}
              delay={1.0}
              colorClass="bg-emerald-100 text-emerald-600"
            />

            <BlurredCard
              icon={<FiXCircle size={20} />}
              title="Skill Gap"
              count={`${skillGap.length} skill perlu dikembangkan`}
              delay={1.1}
              colorClass="bg-rose-100 text-rose-600"
            />

            <BlurredCard
              icon={<BsStars size={20} />}
              title="AI Insight"
              count={`${aiInsight.length} insight dihasilkan`}
              delay={1.2}
              colorClass="bg-amber-100 text-amber-600"
            />

            <BlurredCard
              icon={<FiBriefcase size={20} />}
              title="Summary"
              count={`${summary.length} poin ringkasan`}
              delay={1.3}
              colorClass="bg-blue-100 text-blue-600"
            />
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
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

            {/* Trust badges */}
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