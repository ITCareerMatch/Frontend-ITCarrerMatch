import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft, FiMapPin, FiBriefcase, FiDollarSign, FiClock,
  FiExternalLink, FiCheckCircle, FiXCircle, FiChevronDown,
  FiChevronRight, FiTrendingUp, FiInfo, FiMap
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill } from 'react-icons/bs';
import { fetchJobDetail, fetchAnalysisDetail } from '../../services/api';

export default function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [openInsight, setOpenInsight] = useState('profesional');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobAndAnalysis = async () => {
      try {
        // Ambil Data Utama Job
        const jobDetail = await fetchJobDetail(id);
        setJob(jobDetail);

        // Ambil Data Analisis AI Asli (Jika User Terautentikasi & job memiliki keterkaitan analysis)
        const token = localStorage.getItem('access_token');
        if (token && jobDetail?.analysis_id) {
          try {
            const analysisData = await fetchAnalysisDetail(token, jobDetail.analysis_id);
            setJob(prev => ({ ...prev, analysis: analysisData }));
          } catch (err) {
            console.error('Error fetching analysis details:', err);
          }
        }
      } catch (error) {
        console.error('Error mengambil detail job:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobAndAnalysis();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Memuat detail pekerjaan...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <FiXCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Pekerjaan tidak ditemukan</h2>
        <button onClick={() => navigate('/lowongan')} className="text-blue-600 hover:underline">Kembali ke Daftar Lowongan</button>
      </div>
    );
  }

  // Mengambil data analisis asli (asynchronous) atau menggunakan nilai fallback dasar 
  const matchScore = job?.analysis?.match_score || 85;
  const skillsMatched = job?.analysis?.skill_match || [];
  const skillsGapped = job?.analysis?.skill_gap || [];
  const aiInsightText = job?.analysis?.ai_insight || "Optimasi struktur kalimat pada pengalaman kerja Anda agar terlihat lebih relevan dengan standar industri.";

  return (
    <div className="max-w-7xl mx-auto pb-12 pt-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800 bg-gray-50/50 min-h-screen">
      <button onClick={() => navigate('/lowongan')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium text-sm mb-6 transition-colors cursor-pointer">
        <div className="p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm"><FiArrowLeft /></div>
        Kembali ke Daftar Lowongan
      </button>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-5 items-start">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
             <span className="text-2xl font-bold">{job?.title ? job.title.substring(0, 2).toUpperCase() : 'IT'}</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">{matchScore}% Cocok</span>
            </div>
            <p className="text-gray-500 font-medium mb-4">{job?.company_name}</p>
            <div className="flex flex-wrap gap-3 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 capitalize"><FiMapPin /> {job?.city || 'Remote'}, {job?.province}</span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 capitalize"><FiBriefcase /> {job?.job_type} ({job?.work_system})</span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"><FiDollarSign /> {job?.salary_raw}</span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"><FiClock /> {job?.created_at ? new Date(job.created_at).toLocaleDateString('id-ID') : '-'}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0 shrink-0">
          <button onClick={() => navigate('/editor')} className="bg-blue-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <BsLightbulbFill /> Optimasi CV Dulu
          </button>
          <button className="bg-white text-gray-700 border border-gray-200 font-bold px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">Lamar Langsung <FiExternalLink /></button>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-8 flex items-start gap-4">
        <div className="bg-indigo-600 text-white p-2 rounded-full shrink-0 mt-0.5"><BsStars size={18}/></div>
        <div>
          <h4 className="font-bold text-indigo-900 mb-1">Rekomendasi AI</h4>
          <p className="text-sm text-indigo-700">Tingkatkan skor kecocokan dengan melengkapi kualifikasi kompetensi utama di editor CV Anda.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Persyaratan Pekerjaan</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed whitespace-pre-line">{job?.requirements}</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Informasi Kandidat</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-1"/> Pendidikan: {job?.education_level || '-'}</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-1"/> Usia: {job?.min_age} - {job?.max_age} tahun</li>
                  <li className="flex items-start gap-2 capitalize"><FiCheckCircle className="text-green-500 shrink-0 mt-1"/> Gender: {job?.gender_required === 'both' ? 'Pria & Wanita' : job?.gender_required}</li>
                  <li className="flex items-start gap-2"><FiMap className="text-blue-500 shrink-0 mt-1"/> Lokasi: {job?.location || '-'}</li>
                </ul>
                {job?.age_note && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2 text-xs text-blue-700">
                    <FiInfo size={16} className="shrink-0" />
                    <span><strong>Catatan:</strong> {job.age_note}</span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Skills Utama</h4>
                <div className="flex flex-wrap gap-2">
                  {job?.skills && job.skills.length > 0 ? (
                    job.skills.map((skill, index) => (
                      <span key={index} className="bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">{skill}</span>
                    ))
                  ) : <span className="text-sm text-gray-500">-</span>}
                </div>
              </div>
            </div>
          </div>

          {/* --- REAL DATA INTEGRATION: SKILL MATCH --- */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><FiCheckCircle className="text-green-500"/> Skill Match</h3>
              <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">{skillsMatched.length} Keahlian Cocok</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {skillsMatched.length > 0 ? (
                skillsMatched.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 border border-green-200 bg-green-50 px-4 py-2 rounded-xl text-sm font-bold text-gray-800">
                    <FiCheckCircle className="text-green-500"/> {skill}
                  </div>
                ))
              ) : <p className="text-sm text-gray-400">Belum ada kecocokan skill yang terdeteksi.</p>}
            </div>
          </div>

          {/* --- REAL DATA INTEGRATION: SKILL GAP --- */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><FiXCircle className="text-red-500"/> Skill Gap</h3>
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full">{skillsGapped.length} Perlu Ditingkatkan</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {skillsGapped.length > 0 ? (
                skillsGapped.map((skill, index) => (
                  <div key={index} className="border border-red-100 bg-red-50/50 p-4 rounded-2xl">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{skill}</h4>
                    <p className="text-xs text-gray-500">Tambahkan pengalaman atau project terkait kompetensi ini ke dalam CV Anda.</p>
                  </div>
                ))
              ) : <p className="text-sm text-gray-400">Luar biasa! Tidak ada gap kompetensi yang signifikan.</p>}
            </div>
          </div>

          {/* --- REAL DATA INTEGRATION: AI INSIGHTS --- */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><BsLightbulbFill className="text-yellow-500"/> AI Insight</h3>
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <button onClick={() => setOpenInsight(openInsight === 'ai' ? '' : 'ai')} className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-lg">Rekomendasi Narasi CV</span>
                {openInsight === 'ai' ? <FiChevronDown className="text-gray-500"/> : <FiChevronRight className="text-gray-500"/>}
              </button>
              {openInsight === 'ai' && (
                <div className="p-6 bg-white border-t border-gray-100 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{aiInsightText}</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <h3 className="font-bold text-gray-900 mb-6 text-left">Analisis Kecocokan CV</h3>
            <div className="w-40 h-40 mx-auto rounded-full border-[12px] border-gray-50 flex flex-col items-center justify-center relative mb-4">
              <div className="absolute inset-[-12px] rounded-full border-[12px] border-blue-600" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${matchScore}%, 0 ${matchScore}%)` }}></div>
              <span className="text-4xl font-black text-gray-900">{matchScore}<span className="text-xl">%</span></span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Rincian Pekerjaan</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 text-sm">
                <span className="text-gray-500 flex items-center gap-2"><FiTrendingUp/> Gaji Min</span>
                <span className="font-bold text-gray-900">{job?.salary_min ? `Rp ${job.salary_min.toLocaleString('id-ID')}` : '-'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 text-sm">
                <span className="text-gray-500 flex items-center gap-2"><FiBriefcase/> Gaji Max</span>
                <span className="font-bold text-gray-900">{job?.salary_max ? `Rp ${job.salary_max.toLocaleString('id-ID')}` : '-'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 text-sm">
                <span className="text-gray-500 flex items-center gap-2"><FiInfo/> Sistem Kerja</span>
                <span className="font-bold text-gray-900 capitalize">{job?.work_system || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}