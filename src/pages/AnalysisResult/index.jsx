import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  FiLock, FiCheckCircle, FiXCircle, FiTrendingUp, FiBriefcase, FiMapPin, FiClock, FiDollarSign
} from 'react-icons/fi';
import { BsStars, BsArrowRight } from 'react-icons/bs';

import { fetchJobRecommendations, claimCVSession, fetchAnalysisDetail } from '../../services/api'; 

export default function AnalysisResult() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const isLoggedIn = !!localStorage.getItem('access_token');
  const hasClaimedRef = useRef(false);
  
  const [data, setData] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const guestSessionData = sessionStorage.getItem('guest_cv_result');
      const token = localStorage.getItem('access_token');
      
      // Ambil analysisId dari state saat diarahkan dari halaman History atau NewAnalysis
      const stateAnalysisId = location.state?.analysisId; 

      let analysisData = null;

      try {
        // SKENARIO 1: Pengguna sudah login & memiliki ID Analisis spesifik
        if (isLoggedIn && stateAnalysisId) {
          const result = await fetchAnalysisDetail(token, stateAnalysisId);
          analysisData = result; 
          analysisData.gaugePercentage = ((analysisData.score || 0) / 100) * 440;
          
          if (Array.isArray(analysisData.ai_insight)) {
            analysisData.ai_insights_formatted = analysisData.ai_insight.map((text, i) => ({
               title: `Insight ${i+1}`,
               content: text
            }));
          }
          setData(analysisData);
        } 
        // SKENARIO 2: Pengguna datang dari alur Guest (PreLoginFlow)
        else if (guestSessionData) {
          analysisData = JSON.parse(guestSessionData);
          analysisData.gaugePercentage = ((analysisData.score || 0) / 100) * 440;
          
          if (Array.isArray(analysisData.ai_insight)) {
            analysisData.ai_insights_formatted = analysisData.ai_insight.map((text, i) => ({
               title: `Insight ${i+1}`,
               content: text
            }));
          }
          setData(analysisData);
        } 
        // SKENARIO 3: Direct visit tanpa state (Kembalikan ke halaman utama)
        else {
          navigate(isLoggedIn ? '/dashboard' : '/');
          return;
        }

        // --- Mencegah Balap Lari (Race Condition) dengan Backend ---
        if (isLoggedIn && token) {
          if (analysisData && analysisData.temp_token) {
            // Cek apakah sudah pernah diklaim sebelumnya (Mencegah StrictMode double-fire di React)
            if (!hasClaimedRef.current) {
                hasClaimedRef.current = true; 
                console.log("Mengklaim sesi CV ke akun Anda...");
                await claimCVSession(token, analysisData.temp_token);
                
                const updatedSessionData = { ...analysisData };
                delete updatedSessionData.temp_token;
                sessionStorage.setItem('guest_cv_result', JSON.stringify(updatedSessionData));
            }
            
            // Karena CV baru saja diklaim, pastikan kita tidak menembak API rekomendasi dulu
            console.log("CV berhasil diklaim. Menunggu AI Backend memproses lowongan...");
            setRecommendedJobs([]); 
          } else {
             // Jika tidak ada temp_token (kunjungan normal), ambil rekomendasi pekerjaan
             const realRecommendations = await fetchJobRecommendations(token);
             const mappedJobs = realRecommendations.map(job => ({
               id: job.job_id,
               title: job.job_title,
               company_name: job.company,
               score_match: job.match_score ? Math.round(job.match_score) : 0,
               skills: job.skill_match || [],
               city: job.city || 'Indonesia', 
               province: job.province || '',
               job_type: job.job_type || 'Full-time',
               salary_raw: job.salary_raw || 'Gaji disesuaikan',
               posted: job.posted || 'Terbaru'
             }));
             setRecommendedJobs(mappedJobs);
          }
        } else {
           setRecommendedJobs([]);
        }

      } catch (error) {
        console.error("Gagal load API Rekomendasi/Analisis CV:", error);
        if (!analysisData) navigate('/'); 
        setRecommendedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, isLoggedIn, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <div className="text-lg font-bold text-gray-900 mb-1">AI sedang menganalisis profil Anda...</div>
        <p className="text-sm text-gray-500">Menyusun pemetaan kompetensi karir</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 pb-20">
      
      {/* NAVBAR */}
      <header className="flex justify-between items-center py-4 px-8 border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><BsStars size={18} /></div>
          ITCareerMatch
        </div>
        {isLoggedIn ? (
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm cursor-pointer shadow-md shadow-blue-200">
            Kembali ke Dashboard &rarr;
          </button>
        ) : (
          <button onClick={() => navigate('/login?redirect=/analisis-result')} className="text-gray-600 font-semibold hover:text-blue-600 transition-all text-sm cursor-pointer">
            Masuk / Daftar
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto py-10 px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-3 border border-blue-100 shadow-sm">
            <BsStars className="text-yellow-500" /> Hasil Analisis Kecocokan Karir
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">Evaluasi Kualifikasi CV Anda</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base">Tinjauan mendalam AI mengenai peta kompetensi, keunggulan, celah keahlian, dan peluang kerja yang relevan.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-slate-100/40 text-center flex flex-col justify-center items-center">
              <div className="relative w-44 h-44 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                  <circle 
                    className={`${data?.score >= 80 ? 'text-green-500' : data?.score >= 60 ? 'text-orange-400' : 'text-red-500'} transition-all duration-1000 ease-out`} 
                    strokeWidth="12" strokeDasharray="440" strokeDashoffset={440 - (data?.gaugePercentage || 0)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                  <span className="text-5xl font-black text-gray-900 leading-none">{data?.score || 0}</span>
                  <span className="text-xs font-bold text-gray-400 mt-1">SLA SCORE</span>
                </div>
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${data?.score >= 80 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'} rounded-full text-xs font-extrabold mb-4 border`}>
                <FiTrendingUp /> {data?.score >= 80 ? 'Kompatibilitas Tinggi' : 'Kompatibilitas Moderat'}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{data?.summary || "Rangkuman profil belum tersedia."}</p>
            </div>

            {isLoggedIn && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-lg shadow-slate-100/40 text-center">
                  <div className="text-3xl font-black text-green-600 mb-0.5">{data?.extracted_skills?.length || 0}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Match Skill</div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-lg shadow-slate-100/40 text-center">
                  <div className="text-3xl font-black text-red-500 mb-0.5">{data?.skill_gap?.length || 0}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Gap Skill</div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-2/3 relative">
            {!isLoggedIn && (
              <div className="absolute inset-0 bg-gray-50/10 backdrop-blur-[6px] z-20 flex items-center justify-center p-4">
                <div className="bg-white shadow-2xl p-8 rounded-[2.5rem] border border-gray-100 text-center max-w-md w-full transform translate-y-2">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-blue-100">
                    <FiLock size={24} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">Buka Laporan Resume Lengkap</h3>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">Daftar akun gratis sekarang untuk membuka rincian pemetaan kompetensi kecocokan, peta kelemahan (*skill gap*), dan rekomendasi kalimat koreksi otomatis dari AI.</p>
                  <button 
                    onClick={() => navigate('/login?redirect=/analisis-result')} 
                    className="w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all cursor-pointer"
                  >
                     Masuk / Daftar Akun <BsArrowRight />
                  </button>
                </div>
              </div>
            )}

            <div className={`space-y-6 ${!isLoggedIn ? 'filter blur-[3px] opacity-60 select-none pointer-events-none' : ''}`}>
              
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-100/40 p-6">
                <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-4">
                  <div className="p-2.5 bg-green-50 text-green-600 rounded-xl border border-green-100"><FiCheckCircle size={20} /></div>
                  <h4 className="font-bold text-lg text-gray-900">Keahlian Yang Sesuai (Skill Match)</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(data?.extracted_skills && data.extracted_skills.length > 0 ? data.extracted_skills : ['Belum ada data / Loading...']).map((skill, i) => (
                    <span key={i} className="bg-green-50/70 text-green-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-green-100/50 flex items-center gap-1.5">
                      <FiCheckCircle size={14} className="text-green-500" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-100/40 p-6">
                <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-4">
                  <div className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-red-100"><FiXCircle size={20} /></div>
                  <h4 className="font-bold text-lg text-gray-900">Kompetensi Yang Kurang (Skill Gap)</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(data?.skill_gap && data.skill_gap.length > 0 ? data.skill_gap : ['Belum ada data / Loading...']).map((skill, i) => (
                    <span key={i} className="bg-red-50/70 text-red-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-100/50 flex items-center gap-1.5">
                      <FiXCircle size={14} className="text-red-500" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-[2rem] p-6 shadow-xl shadow-purple-200/40 text-white">
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <div className="p-2.5 bg-white/15 backdrop-blur-sm text-yellow-300 rounded-xl"><BsStars size={20} /></div>
                  <h4 className="font-bold text-lg text-white">Rekomendasi Konstruksi Narasi AI</h4>
                </div>
                <div className="space-y-3">
                  {(data?.ai_insights_formatted && data.ai_insights_formatted.length > 0 ? data.ai_insights_formatted : [{title: "Info", content: "Saran AI belum tersedia."}]).map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs">
                      <strong className="text-yellow-300 block mb-1">{item.title}</strong>
                      <p className="text-purple-100 leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center border border-orange-100 shadow-sm"><FiBriefcase size={20}/></div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Rekomendasi Karir Terkait</h2>
                <p className="text-xs text-gray-400 mt-0.5">Daftar pekerjaan dengan tingkat kecocokan tertinggi bagi profil Anda.</p>
              </div>
            </div>
            <Link to="/lowongan" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              Lihat Semua Lowongan
            </Link>
          </div>

          <div className="space-y-4">
            {recommendedJobs.length === 0 && isLoggedIn ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-500 text-sm">
                Belum ada rekomendasi pekerjaan saat ini, atau AI sedang memproses pembaruan.
              </div>
            ) : recommendedJobs.length === 0 && !isLoggedIn ? (
               <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm filter blur-[2px]">
                Daftar sekarang untuk melihat lowongan (Terkunci)
              </div>
            ) : (
              recommendedJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0 text-lg">
                        {job.title?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer" onClick={() => navigate(isLoggedIn ? `/detail/${job.id}` : '#')}>
                            {job.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FiBriefcase className="text-gray-400"/> <span>{job.company_name}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <FiMapPin className="text-gray-400"/> <span>{job.city} {job.province && `, ${job.province}`}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1.5 ${job.score_match >= 80 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'} rounded-xl text-xs font-black whitespace-nowrap border shadow-sm`}>
                      {job.score_match}% Match
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-5">
                    <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1.5 capitalize">
                      <FiBriefcase size={13}/> {job.job_type}
                    </span>
                    <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
                      <FiDollarSign size={13}/> {job.salary_raw}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills && job.skills.map((skill, idx) => (
                      <span key={idx} className="bg-white border border-gray-200 text-gray-500 text-xs px-2.5 py-1 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><FiClock/> {job.posted}</span>
                    </div>
                    
                    {isLoggedIn ? (
                      <button 
                        onClick={() => navigate(`/detail/${job.id}`)} 
                        className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Lamar Sekarang &rarr;
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate('/login?redirect=/analisis-result')} 
                        className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100/40"
                      >
                        <FiLock size={12} /> Daftar untuk Melamar &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}