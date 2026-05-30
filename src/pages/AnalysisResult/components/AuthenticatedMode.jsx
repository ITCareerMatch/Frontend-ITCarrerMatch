import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  FiCheckCircle, FiXCircle, FiTrendingUp,
  FiBriefcase, FiArrowLeft, FiCopy, FiTarget,
  FiZap, FiStar, FiAward, FiBookmark
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import Swal from 'sweetalert2';

/**
 * Animated Circular Score Ring Component
 * Animated SVG circle that fills based on score percentage with particle effects
 */
function AnimatedScoreRing({ score, size = 240, strokeWidth = 16 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    const duration = 2500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setAnimatedScore(Math.round(score * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [score]);

  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (s) => {
    if (s >= 80) return { stroke: '#10b981', glow: '#10b981', text: 'emerald', label: 'Excellent' };
    if (s >= 60) return { stroke: '#f59e0b', glow: '#f59e0b', text: 'amber', label: 'Good' };
    return { stroke: '#f43f5e', glow: '#f43f5e', text: 'rose', label: 'Needs Work' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Glow background */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle with glow */}
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
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          filter="url(#glow)"
        />

        {/* Inner glow ring for high scores */}
        {score >= 80 && (
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth + 8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference, opacity: 0.3 }}
            animate={{ strokeDashoffset, opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, opacity: { duration: 2, repeat: Infinity } }}
          />
        )}

        {/* Tick marks */}
        {[...Array(20)].map((_, i) => {
          const angle = (i * 18) - 90;
          const rad = (angle * Math.PI) / 180;
          const x1 = center + (radius + strokeWidth / 2 + 8) * Math.cos(rad);
          const y1 = center + (radius + strokeWidth / 2 + 8) * Math.sin(rad);
          const x2 = center + (radius + strokeWidth / 2 + 15) * Math.cos(rad);
          const y2 = center + (radius + strokeWidth / 2 + 15) * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i * 5 <= score ? colors.stroke : '#e2e8f0'}
              strokeWidth={i % 5 === 0 ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Center content */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <motion.span
          key={animatedScore}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-6xl font-black text-slate-900`}
        >
          {animatedScore}
        </motion.span>
        <span className="text-2xl font-bold text-slate-400">%</span>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`mt-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            colors.text === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
            colors.text === 'amber' ? 'bg-amber-100 text-amber-700' :
            'bg-rose-100 text-rose-700'
          }`}
        >
          {colors.label}
        </motion.div>

        {/* Mini stats */}
        <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <FiCheckCircle size={12} className="text-emerald-500" />
            Skill Match
          </span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span className="flex items-center gap-1">
            <FiTarget size={12} className="text-rose-500" />
            Skill Gap
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Animated Section Wrapper
 */
function AnimatedSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Skill Tag Component with hover animation
 */
function SkillTag({ skill, type = 'match', delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`px-4 py-2 rounded-xl text-sm font-semibold border cursor-pointer transition-all ${
        type === 'match'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:shadow-md'
          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:shadow-md'
      }`}
      whileHover={{ scale: 1.05, y: -2 }}
    >
      {typeof skill === 'string' ? skill : skill?.name || 'Skill'}
    </motion.span>
  );
}

/**
 * Job Card Component
 */
function JobCard({ job, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => window.location.href = `/dashboard/detail/${job.job_id}`}
      className="bg-white border border-slate-200/60 rounded-2xl p-5 hover:shadow-xl hover:border-blue-200/80 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Company Avatar */}
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-600 text-lg group-hover:shadow-md transition-shadow"
        >
          {job.job_title?.substring(0, 2).toUpperCase() || 'JB'}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {job.job_title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>

          {/* Match score badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * index + 0.2 }}
            className="flex items-center gap-2 mt-3"
          >
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
              job.match_score >= 80
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : job.match_score >= 60
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              <FiTrendingUp size={14} />
              {Math.round(job.match_score)}% Match
            </span>

            {job.skill_match?.length > 0 && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <FiCheckCircle size={12} />
                {job.skill_match.length} skill
              </span>
            )}
          </motion.div>
        </div>

        {/* Bookmark icon */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition-colors"
        >
          <FiBookmark size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * AuthenticatedMode Component (Unlocked)
 * Displays full analysis results for authenticated users
 * Includes job recommendations based on cv_id
 */
export default function AuthenticatedMode({ data, recommendedJobs, onBackClick }) {
  // Extract data from API response
  const score = data?.match_score ?? data?.score ?? 0;
  const extractedSkills = data?.extracted_skills ?? data?.skill_match ?? [];
  const skillGap = data?.skill_gap ?? [];
  const aiInsight = data?.ai_insight ?? data?.ai_insights ?? '';
  const summary = data?.summary ?? data?.ai_summary ?? 'Analisis selesai.';

  // Copy AI Insight to clipboard
  const copyInsight = (text) => {
    navigator.clipboard.writeText(Array.isArray(text) ? text.join('\n') : text);
    Swal.fire({
      icon: 'success',
      title: 'Disalin!',
      text: 'Insight berhasil disalin ke clipboard',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-slate-800 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={onBackClick}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
          >
            <FiArrowLeft size={18} /> Kembali
          </motion.button>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <Link
              to="/analisis-baru"
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100"
            >
              + Analisis Baru
            </Link>
            <Link
              to="/dashboard"
              className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Dashboard
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Hero Score Section */}
        <AnimatedSection delay={0} className="text-center mb-16">
          {/* Success Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold mb-6 border border-emerald-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <FiAward size={14} />
            </motion.div>
            Analisis CV Selesai
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight"
          >
            Evaluasi Kualifikasi CV Anda
          </motion.h1>

          <motion.p
            className="text-slate-500 mb-12 max-w-md mx-auto leading-relaxed"
          >
            Berikut hasil analisis mendalam CV Anda oleh AI. Lihat rekomendasi dan insight untuk meningkatkan peluang kerja.
          </motion.p>

          {/* Animated Score Ring */}
          <motion.div
            className="inline-block"
          >
            <AnimatedScoreRing score={score} size={260} strokeWidth={18} />
          </motion.div>

          {/* Summary */}
          <motion.p
            className="mt-8 text-slate-600 max-w-2xl mx-auto leading-relaxed bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50"
          >
            {summary}
          </motion.p>
        </AnimatedSection>

        {/* Stats Cards */}
        <AnimatedSection delay={0.3} className="grid grid-cols-2 gap-4 mb-12">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl border border-emerald-200/40 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30 relative z-10"
            >
              <FiCheckCircle size={28} />
            </motion.div>
            <div className="text-4xl font-black text-emerald-700 mb-1 relative z-10">
              {extractedSkills.length}
            </div>
            <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider relative z-10">
              Skill Cocok
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 rounded-2xl border border-rose-200/40 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full blur-3xl" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/30 relative z-10"
            >
              <FiTarget size={28} />
            </motion.div>
            <div className="text-4xl font-black text-rose-700 mb-1 relative z-10">
              {skillGap.length}
            </div>
            <div className="text-xs text-rose-600 font-bold uppercase tracking-wider relative z-10">
              Skill Gap
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Skills Section */}
        <div className="space-y-6">
          {/* Skill Match */}
          <AnimatedSection delay={0.4}>
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"
                >
                  <FiCheckCircle size={22} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Skill Yang Sesuai</h3>
                  <p className="text-xs text-slate-500">Keahlian yang cocok dengan lowongan target</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold">
                  {extractedSkills.length} skill
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.length > 0 ? extractedSkills.map((s, i) => (
                  <SkillTag key={i} skill={s} type="match" delay={0.5 + i * 0.05} />
                )) : (
                  <span className="text-slate-400 text-sm">Tidak ada skill yang cocok</span>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Skill Gap */}
          <AnimatedSection delay={0.5}>
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  className="w-11 h-11 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"
                >
                  <FiXCircle size={22} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Skill Yang Perlu Dikembangkan</h3>
                  <p className="text-xs text-slate-500">Konsentrasi untuk meningkatkan nilai CV Anda</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold">
                  {skillGap.length} skill
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillGap.length > 0 ? skillGap.map((s, i) => (
                  <SkillTag key={i} skill={s} type="gap" delay={0.6 + i * 0.05} />
                )) : (
                  <span className="text-slate-400 text-sm">Tidak ada skill gap signifikan</span>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* AI Insight */}
          {aiInsight && (
            <AnimatedSection delay={0.6}>
              <motion.div
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 1 }}
                      className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30"
                    >
                      <BsStars size={24} />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-white text-lg">AI Insight</h3>
                      <p className="text-xs text-slate-400">Rekomendasi personal dari analisis mendalam</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyInsight(aiInsight)}
                    className="p-2 bg-white/10 text-white/70 hover:text-white rounded-xl hover:bg-white/20 transition-colors"
                    title="Salin insight"
                  >
                    <FiCopy size={18} />
                  </motion.button>
                </div>

                <div className="text-slate-300 leading-relaxed relative z-10">
                  {Array.isArray(aiInsight) ? (
                    <ul className="space-y-3">
                      {aiInsight.map((insight, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="w-6 h-6 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{insight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p>{aiInsight}</p>
                  )}
                </div>
              </motion.div>
            </AnimatedSection>
          )}
        </div>

        {/* Job Recommendations */}
        {recommendedJobs.length > 0 && (
          <AnimatedSection delay={0.8} className="mt-12">
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"
                  >
                    <FiBriefcase size={22} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Rekomendasi Karir</h3>
                    <p className="text-xs text-slate-500">Lowongan paling cocok untuk Anda</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold">
                  {recommendedJobs.length} lowongan
                </span>
              </div>

              <div className="p-6 grid sm:grid-cols-2 gap-4">
                {recommendedJobs.slice(0, 4).map((job, i) => (
                  <JobCard key={job.job_id || i} job={job} index={i} />
                ))}
              </div>

              {recommendedJobs.length > 4 && (
                <div className="p-6 pt-0">
                  <Link
                    to="/lowongan"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Lihat Semua {recommendedJobs.length} Rekomendasi
                    <FiTrendingUp size={16} />
                  </Link>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* Empty state */}
        {recommendedJobs.length === 0 && (
          <AnimatedSection delay={0.8}>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">Belum Ada Rekomendasi</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                Selesaikan analisis CV baru untuk mendapatkan rekomendasi pekerjaan.
              </p>
              <Link
                to="/analisis-baru"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <FiZap size={18} />
                Analisis CV Baru
              </Link>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}