import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiBriefcase, FiMapPin, FiDollarSign, FiInfo, FiFileText,
  FiClock, FiCheckCircle
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

/**
 * Reusable JobCard Component
 *
 * @param {object} job - Job data object
 * @param {string} variant - 'default' | 'compact'
 * @param {boolean} showAuthStatus - Show login status badge
 * @param {function} onClick - Custom click handler (optional)
 */
export default function JobCard({
  job,
  variant = 'default',
  showAuthStatus = false,
  onClick,
  isLoggedIn = false
}) {
  const navigate = useNavigate();

  // Animation config
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(job);
    } else {
      navigate(`/detail/${job?.id || job?.job_id}`);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Location display
  const locationText = job?.location ||
    `${[job?.city, job?.province].filter(Boolean).join(', ') || 'Indonesia'}`;

  // Company initial
  const companyInitial = job?.title?.substring(0, 1).toUpperCase() || 'J';

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -3 }}
      onClick={handleClick}
      className={`
        bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm
        hover:shadow-xl hover:shadow-slate-200/30 hover:border-blue-200/80
        transition-all group cursor-pointer flex flex-col text-left
        relative overflow-hidden
        ${variant === 'compact' ? 'p-5' : 'p-6'}
      `}
    >
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors" />

      {/* Header - Company & Title */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          {/* Company Avatar */}
          <div className={`
            bg-gradient-to-tr from-slate-50 to-slate-100 border border-slate-200
            text-slate-700 rounded-2xl flex items-center justify-center font-black
            shadow-inner shrink-0 group-hover:from-blue-50 group-hover:to-indigo-50
            group-hover:text-blue-600 group-hover:border-blue-100 transition-colors
            ${variant === 'compact' ? 'w-10 h-10 text-lg' : 'w-12 h-12 text-xl'}
          `}>
            {companyInitial}
          </div>

          {/* Title & Company */}
          <div>
            <h3 className={`
              font-bold text-slate-900 group-hover:text-blue-600 transition-colors
              line-clamp-1 mb-1
              ${variant === 'compact' ? 'text-base' : 'text-lg'}
            `}>
              {job?.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 font-semibold">
              <span className="text-slate-700 flex items-center gap-1.5 font-bold">
                <FiBriefcase className="text-slate-400" /> {job?.company_name}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>
              <span className="flex items-center gap-1.5 font-medium">
                <FiMapPin className="text-slate-400" /> {locationText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Salary */}
        <span className="bg-emerald-500/5 text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-500/10 flex items-center gap-1.5 shadow-sm">
          <FiDollarSign size={13} className="text-emerald-500 shrink-0" />
          {job?.salary_raw || 'Gaji Kompetitif'}
        </span>

        {/* Job Type */}
        {job?.job_type && (
          <span className="bg-slate-50 text-slate-500 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-1.5">
            <FiBriefcase size={12} className="text-slate-400 shrink-0" />
            {job.job_type}
          </span>
        )}

        {/* Work System */}
        {job?.work_system && (
          <span className="bg-blue-500/5 text-blue-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-blue-500/10 shadow-sm flex items-center gap-1.5 capitalize">
            <FiInfo size={12} className="text-blue-500 shrink-0" />
            {job.work_system}
          </span>
        )}

        {/* Education Level */}
        {job?.education_level && (
          <span className="bg-purple-500/5 text-purple-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-purple-500/10 shadow-sm flex items-center gap-1.5">
            <FiFileText size={12} className="text-purple-500 shrink-0" />
            {job.education_level}
          </span>
        )}
      </div>

      {/* Skills Tags */}
      {job?.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="bg-white border border-slate-200 text-slate-400 text-[10px] font-extrabold px-2.5 py-1 rounded-lg"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-slate-400 text-[10px] font-extrabold px-2 py-1 bg-slate-50 rounded-lg border border-slate-200">
              +{job.skills.length - 4} Lainnya
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={`
        flex flex-col sm:flex-row sm:justify-between sm:items-center
        pt-4 border-t border-slate-100 gap-4 mt-auto
        ${variant === 'compact' ? 'pt-3' : 'pt-4'}
      `}>
        {/* Auth Status Badge */}
        {showAuthStatus && (
          <div className="flex items-center gap-3 text-xs">
            {isLoggedIn ? (
              <span className="font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/5 text-emerald-600 border border-emerald-500/10">
                <FiCheckCircle className="text-emerald-500" />
                Terhubung dengan CV
              </span>
            ) : (
              <span className="text-purple-600 bg-purple-500/5 px-2.5 py-1 rounded-lg border border-purple-500/10 font-bold flex items-center gap-1.5">
                <BsStars className="text-purple-500" />
                AI Matcher Tersedia
              </span>
            )}
          </div>
        )}

        {/* Match Score (if available) */}
        {job?.match_score !== undefined && job?.match_score !== null && (
          <div className={`
            px-3 py-1.5 rounded-lg font-bold text-xs
            ${job.match_score >= 80
              ? 'bg-emerald-500/5 text-emerald-600 border border-emerald-500/10'
              : 'bg-amber-500/5 text-amber-600 border border-amber-500/10'
            }
          `}>
            {Math.round(job.match_score)}% Match
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <FiClock />
            {formatDate(job?.created_at)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}