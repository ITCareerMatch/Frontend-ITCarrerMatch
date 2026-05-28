import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiXCircle, FiTrendingUp, FiBriefcase,
  FiMapPin, FiClock, FiDollarSign, FiArrowLeft
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchAnalysisDetail, fetchJobRecommendations } from '../../services/api';

// Konfigurasi animasi seragam
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

// Helper: normalkan field score
const normalizeScore = (item) => item?.match_score ?? item?.score ?? 0;

// Helper: mapping response rekomendasi ke format konsisten
const mapJobRecommendations = (recs) =>
  (recs || []).map((job) => ({
    id: job.job_id,
    title: job.job_title,
    company_name: job.company,
    score_match: Math.round(job.match_score || 0),
    skills: job.skill_match || [],
    city: job.city || 'Indonesia',
    province: job.province || '',
    job_type: job.job_type || 'Full-time',
    salary_raw: job.salary_raw || 'Gaji disesuaikan',
    posted: job.posted || 'Terbaru',
  }));

// Helper: format data analisis dari response API
const formatAnalysisData = (detail) => {
  const score = normalizeScore(detail);
  return {
    ...detail,
    score,
    gaugePercentage: (score / 100) * 440,
    ai_insights_formatted: Array.isArray(detail.ai_insight)
      ? detail.ai_insight.map((text, i) => ({ title: `Insight ${i + 1}`, content: text }))
      : [],
  };
};

export default function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data saat komponen mount
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Ambil detail analisis
        const detail = await fetchAnalysisDetail(token, id);
        setData(formatAnalysisData(detail));

        // 2. Ambil rekomendasi lowongan
        try {
          const recs = await fetchJobRecommendations(token);
          setRecommendedJobs(mapJobRecommendations(recs));
        } catch (e) {
          console.warn('Gagal fetch rekomendasi:', e);
        }

      } catch (err) {
        console.error('Gagal memuat detail analisis:', err);
        setError(err.message || 'Gagal memuat data analisis');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center relative select-none animate-fadeIn">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.2] -z-10 pointer-events-none" />
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <div className="text-sm font-extrabold text-slate-900 mb-1 tracking-tight uppercase">Memuat detail analisis...</div>
        <p className="text-xs text-slate-400 font-semibold">Menyusun peta keahlian dan kompetensi karir</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/10">
          <FiXCircle size={28} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Gagal Memuat Analisis</h2>
        <p className="text-sm text-slate-500 text-center max-w-xs mb-8 font-semibold leading-relaxed">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Data Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 text-center max-w-xs mb-8 font-semibold leading-relaxed">Analisis dengan ID ini tidak ditemukan.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20 relative selection:bg-blue-500/10 selection:text-blue-600 animate-fadeIn">

      {/* Grid Backdrop & Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.22] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent -z-10 pointer-events-none" />

      {/* NAVBAR */}
      <header className="flex justify-between items-center h-20 px-6 md:px-12 lg:px-16 fixed inset-x-0 top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/60 shadow-md shadow-slate-100/30">
        <div
          className="flex items-center gap-3 font-bold text-xl text-slate-900 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-11 h-11 object-contain relative rounded-2xl transition-transform duration-500 group-hover:rotate-6" />
          </div>
          <span className="bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent font-extrabold tracking-tight">
            ITCareerMatch
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-950 transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            <FiArrowLeft size={14} />
            Kembali
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-slate-950 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-md shadow-slate-950/10"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-32 px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/5 text-blue-600 rounded-full text-xs font-bold mb-4 border border-blue-500/10 shadow-sm">
            <BsStars className="text-amber-500" /> Detail Riwayat Analisis
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Evaluasi Kualifikasi CV Anda</h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-medium">Tinjauan mendalam AI mengenai peta kompetensi, keunggulan, celah keahlian, dan peluang kerja yang relevan.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-16">

          {/* KOLOM GAUGE SCORE */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-slate-200/60 shadow-lg shadow-slate-200/30 text-center flex flex-col justify-center items-center relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20 -translate-y-1/2 translate-x-1/2 ${data?.score >= 80 ? 'bg-emerald-50' : 'bg-amber-50'}`} />

              <div className="relative w-44 h-44 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                  <circle
                    className={`${data?.score >= 80 ? 'text-emerald-500' : data?.score >= 60 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000 ease-out`}
                    strokeWidth="12" strokeDasharray="440" strokeDashoffset={440 - (data?.gaugePercentage || 0)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80"
                    style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.05))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                  <span className="text-5xl font-black text-slate-950 leading-none">{data?.score || 0}</span>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5">SLA SCORE</span>
                </div>
              </div>

              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider mb-4 border ${data?.score >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                <FiTrendingUp /> {data?.score >= 80 ? 'Kompatibilitas Tinggi' : 'Kompatibilitas Moderat'}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold max-w-xs">{data?.summary || 'Rangkuman profil belum tersedia.'}</p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 shadow-sm text-center">
                <div className="text-3xl font-black text-emerald-600 mb-0.5">{data?.extracted_skills?.length || 0}</div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Match Skill</div>
              </div>
              <div className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 shadow-sm text-center">
                <div className="text-3xl font-black text-rose-500 mb-0.5">{data?.skill_gap?.length || 0}</div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Gap Skill</div>
              </div>
            </motion.div>
          </div>

          {/* KOLOM DETAIL ANALISIS */}
          <div className="w-full lg:w-2/3 relative flex flex-col justify-stretch">
            <div className="space-y-6 flex-1 flex flex-col justify-between">

              {/* Panel Skill Match */}
              <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/30 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/10"><FiCheckCircle size={18} /></div>
                  <h4 className="font-extrabold text-slate-900 text-base">Keahlian Yang Sesuai (Skill Match)</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(data?.extracted_skills && data.extracted_skills.length > 0 ? data.extracted_skills : ['Belum ada data']).map((skill, i) => (
                    <span key={i} className="bg-emerald-500/5 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/10 flex items-center gap-1.5 transition-all hover:scale-[1.03]">
                      <FiCheckCircle size={13} className="text-emerald-500 shrink-0" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Panel Skill Gap */}
              <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/30 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/10"><FiXCircle size={18} /></div>
                  <h4 className="font-extrabold text-slate-900 text-base">Kompetensi Yang Kurang (Skill Gap)</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(data?.skill_gap && data.skill_gap.length > 0 ? data.skill_gap : ['Belum ada data']).map((skill, i) => (
                    <span key={i} className="bg-rose-500/5 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-500/10 flex items-center gap-1.5 transition-all hover:scale-[1.03]">
                      <FiXCircle size={13} className="text-rose-500 shrink-0" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Panel AI Insights */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 shadow-xl border border-slate-800 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4 relative z-10">
                  <div className="p-2 bg-white/5 text-amber-300 rounded-xl border border-white/10"><BsStars size={18} /></div>
                  <h4 className="font-extrabold text-white text-base">Rekomendasi Konstruksi Narasi AI</h4>
                </div>
                <div className="space-y-3 relative z-10">
                  {(data?.ai_insights_formatted && data.ai_insights_formatted.length > 0 ? data.ai_insights_formatted : [{ title: 'Info', content: 'Saran AI belum tersedia.' }]).map((item, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-xs font-medium">
                      <strong className="text-amber-300 block mb-1.5 font-bold uppercase tracking-wider">{item.title}</strong>
                      <p className="text-slate-300 leading-relaxed font-medium">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* REKOMENDASI LOWONGAN KERJA */}
        <div className="mt-16 border-t border-slate-200/60 pt-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center border border-blue-500/10"><FiBriefcase size={20}/></div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Rekomendasi Karir Terkait</h2>
                <p className="text-xs text-slate-500 mt-1 font-semibold">Daftar pekerjaan dengan tingkat kecocokan tertinggi bagi profil Anda.</p>
              </div>
            </div>
            <Link to="/lowongan" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-500/5 px-4 py-2 rounded-xl border border-blue-500/10 uppercase tracking-wide">
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-4">
            {recommendedJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/60 text-slate-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                Belum ada rekomendasi pekerjaan saat ini.
              </div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-4"
              >
                {recommendedJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    variants={fadeInUp}
                    whileHover={{ y: -3 }}
                    className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-200/80 transition-all group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-slate-50 to-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-700 shadow-inner text-lg group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                          {job.title?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3
                            className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer mb-1"
                            onClick={() => navigate(`/dashboard/detail/${job.id}`)}
                          >
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                            <FiBriefcase className="text-slate-400"/> <span className="text-slate-700 font-bold">{job.company_name}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <FiMapPin className="text-slate-400"/> <span className="font-medium">{job.city}{job.province && `, ${job.province}`}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`px-3 py-1.5 ${job.score_match >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-500/10' : 'bg-amber-50 text-amber-700 border-amber-500/10'} rounded-xl text-xs font-black whitespace-nowrap border shadow-sm`}>
                        {job.score_match}% Match
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200/60 flex items-center gap-1.5 capitalize tracking-wide">
                        <FiBriefcase size={12}/> {job.job_type}
                      </span>
                      <span className="bg-emerald-500/5 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-500/10 tracking-wide">
                        <FiDollarSign size={12}/> {job.salary_raw}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {job.skills && job.skills.map((skill, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><FiClock/> {job.posted}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/dashboard/detail/${job.id}`)}
                        className="text-blue-600 text-xs font-bold hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                      >
                        Lamar Sekarang &rarr;
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}