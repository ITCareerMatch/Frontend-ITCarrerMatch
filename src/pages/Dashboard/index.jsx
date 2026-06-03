/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiFileText, FiZap, FiCheckCircle, FiTarget } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchUserProfile, fetchJobRecommendations, fetchCVArchives } from '../../services/api';
import Swal from 'sweetalert2';

// Components
import StatsCards from './components/StatsCards';
import RecommendationsList from './components/RecommendationsList';

/**
 * Dashboard Page
 * Endpoints yang digunakan:
 * - GET /api/v1/user/profile - Ambil data profil user
 * - GET /api/v1/jobs/recommendations - Ambil top 20 rekomendasi pekerjaan
 * - GET /api/v1/analysis/history - Ambil riwayat analisis (limit 5 untuk preview)
 */

// Helper: Calculate profile completeness
const getProfileCompleteness = (profile) => {
  if (!profile) return { score: 0, items: [], completed: 0, total: 0 };

  const items = [
    { label: 'Nama', done: !!profile.name },
    { label: 'Email', done: !!profile.email },
    { label: 'Gender', done: !!profile.gender },
    { label: 'Tanggal Lahir', done: !!profile.birth_date },
    { label: 'Pendidikan', done: !!profile.education_level },
    { label: 'Pengalaman', done: !!profile.experience_level },
    { label: 'Kota', done: !!profile.city },
    { label: 'Bio', done: !!profile.bio },
    { label: 'Skills', done: !!profile.skills_overview },
    { label: 'Avatar', done: !!profile.avatar_url },
  ];

  const completed = items.filter(i => i.done).length;
  const score = Math.round((completed / items.length) * 100);

  return { score, items, completed, total: items.length };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [latestCv, setLatestCv] = useState(null);
  const [archives, setArchives] = useState([]);

  // Load all data on mount
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      // 1. Fetch Profile
      setProfileLoading(true);
      setJobsLoading(true);

      try {
        const profileData = await fetchUserProfile(token);
        setProfile(profileData);
      } catch (err) {
        console.error('Gagal memuat profil:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('access_token');
          navigate('/login');
          return;
        }
      } finally {
        setProfileLoading(false);
      }

      // 2. Fetch Archives & Recommendations
      try {
        const archivesResult = await fetchCVArchives(token);
        const archivesData = archivesResult?.data || [];
        setArchives(archivesData);

        // Simpan CV terakhir untuk StatsCards
        setLatestCv(archivesData[0] || null);

        // Cari CV dengan status completed atau yang terbaru untuk rekomendasi
        const latestCvForRecs = archivesData.find(cv => cv.status === 'completed') || archivesData[0];

        if (latestCvForRecs?.id) {
          const recs = await fetchJobRecommendations(token, latestCvForRecs.id);
          const recsData = Array.isArray(recs) ? recs : [];
          const sortedRecs = recsData.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
          setJobRecommendations(sortedRecs.slice(0, 20));
        } else {
          setJobRecommendations([]);
        }
      } catch (err) {
        console.warn('Rekomendasi belum tersedia:', err.message);
      } finally {
        setJobsLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  // Calculate values
  const profileCompleteness = getProfileCompleteness(profile);

  // Get user greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 18) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  const displayName = profile?.name || profile?.email?.split('@')[0] || 'Pengguna';

  return (
    <div className="max-w-7xl mx-auto pb-10 selection:bg-blue-500/10 selection:text-blue-600 animate-fadeIn">

      {/* HEADER: Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm border border-white/10">
              <BsStars className="text-amber-400" />
              {getGreeting()}, {displayName}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
              Siap Cari Kerja Impianmu?
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              {jobRecommendations.length > 0
                ? `AI kami menemukan ${jobRecommendations.length} lowongan yang cocok dengan profil Anda.`
                : 'Lengkapi profil dan upload CV untuk mendapatkan rekomendasi kerja.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/analisis-baru')}
              className="flex items-center justify-center gap-2 bg-white text-slate-900 font-bold px-6 py-3.5 rounded-2xl hover:bg-slate-100 transition-all shadow-lg text-sm cursor-pointer"
            >
              <FiPlusCircle size={18} />
              Analisis CV Baru
            </button>
            <button
              onClick={() => navigate('/riwayat')}
              className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10 text-sm cursor-pointer"
            >
              <FiFileText size={18} />
              Lihat Riwayat
            </button>
          </div>
        </div>
      </motion.div>

      {/* STATS CARDS */}
      <StatsCards
        profileCompleteness={profileCompleteness}
        jobCount={jobRecommendations.length}
        archives={archives}
        onNavigate={(path) => navigate(path)}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: Jobs & Actions */}
        <div className="lg:w-1/1 space-y-6">
          <RecommendationsList
            jobs={jobRecommendations}
            loading={jobsLoading}
            onNavigate={(path) => navigate(path)}
            onViewAll={() => navigate('/riwayat')}
            onAnalyze={() => navigate('/analisis-baru')}
          />
        </div>
      </div>
    </div>
  );
}