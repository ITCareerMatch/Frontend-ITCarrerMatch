import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiMapPin, FiBriefcase, FiDollarSign, FiClock, 
  FiExternalLink, FiCheckCircle, FiXCircle, FiChevronDown, 
  FiChevronRight, FiTrendingUp, FiInfo
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill } from 'react-icons/bs';

export default function JobDetail() {
  const navigate = useNavigate();
  const [openInsight, setOpenInsight] = useState('profesional');

  return (
    <div className="max-w-7xl mx-auto pb-12 font-sans text-gray-800">
      
      {/* --- TOMBOL KEMBALI --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium text-sm mb-6 transition-colors"
      >
        <div className="p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm"><FiArrowLeft /></div>
        Kembali ke Dashboard
      </button>

      {/* --- HEADER LOWONGAN (Konteks Pekerjaan) --- */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-5 items-start">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shrink-0">
            <FiBriefcase className="text-gray-400" size={28} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Software Engineer</h1>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">85% Cocok</span>
            </div>
            <p className="text-gray-500 font-medium mb-4">DigitalNusantara</p>
            
            <div className="flex flex-wrap gap-3 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"><FiMapPin /> Surabaya, Indonesia</span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"><FiBriefcase /> Contract</span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"><FiDollarSign /> Rp 15-25 juta/bulan</span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"><FiClock /> 1 minggu lalu</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0 shrink-0">
          <button onClick={() => navigate('/editor')} className="bg-blue-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <BsLightbulbFill /> Optimasi CV Dulu
          </button>
          <button className="bg-white text-gray-700 border border-gray-200 font-bold px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            Lamar Langsung <FiExternalLink />
          </button>
        </div>
      </div>

      {/* --- BANNER REKOMENDASI AI --- */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-8 flex items-start gap-4">
        <div className="bg-indigo-600 text-white p-2 rounded-full shrink-0 mt-0.5"><BsStars size={18}/></div>
        <div>
          <h4 className="font-bold text-indigo-900 mb-1">Rekomendasi AI</h4>
          <p className="text-sm text-indigo-700">CV Anda memiliki 2 skill gap untuk posisi ini. Optimasi CV terlebih dahulu dapat meningkatkan peluang Anda hingga <strong className="text-indigo-900">3x lipat</strong>!</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ========================================== */}
        {/* KOLOM KIRI (Detail Pekerjaan & Analisis Mendalam) */}
        {/* ========================================== */}
        <div className="lg:w-2/3 space-y-8">
          
          {/* Deskripsi & Persyaratan Pekerjaan */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Deskripsi Pekerjaan</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">Mencari software engineer untuk proyek pengembangan platform digital berskala besar. Anda akan bekerja dalam tim lintas fungsi untuk membangun layanan backend yang tangguh dan dapat diskalakan.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Tanggung Jawab</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-1"/> Develop backend services</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-1"/> API integration</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-1"/> Testing & Debugging</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Benefit & Fasilitas</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"><FiCheckCircle/> WFH 3x/minggu</span>
                  <span className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"><FiCheckCircle/> Kontrak 12 bulan</span>
                  <span className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"><FiCheckCircle/> Asuransi Kesehatan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Match (Dari Dashboard.jpg) */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><FiCheckCircle className="text-green-500"/> Skill Match</h3>
              <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">2 Keahlian Cocok</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Keahlian yang sudah Anda miliki dan sesuai dengan target lowongan.</p>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 border border-green-200 bg-green-50 px-4 py-2 rounded-xl text-sm">
                <FiCheckCircle className="text-green-500"/> 
                <span className="font-bold text-gray-800">REST API</span>
                <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Advanced</span>
              </div>
              <div className="flex items-center gap-2 border border-green-200 bg-green-50 px-4 py-2 rounded-xl text-sm">
                <FiCheckCircle className="text-green-500"/> 
                <span className="font-bold text-gray-800">PostgreSQL</span>
                <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Intermediate</span>
              </div>
            </div>
          </div>

          {/* Skill Gap (Dari Dashboard.jpg) */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><FiXCircle className="text-red-500"/> Skill Gap</h3>
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full">2 Perlu Ditingkatkan</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Keahlian yang diminta lowongan tetapi belum tercantum di CV Anda.</p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-red-100 bg-red-50/50 p-5 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-900 text-base">Microservices</h4>
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase">Tinggi</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">Pelajari pola desain microservices dan sertakan project terkait di CV Anda.</p>
              </div>
              <div className="border border-orange-100 bg-orange-50/50 p-5 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-900 text-base">Kubernetes</h4>
                  <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase">Sedang</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">Pahami orkestrasi container dasar menggunakan K8s atau Docker Swarm.</p>
              </div>
            </div>
          </div>

          {/* AI Insight (Dari Dashboard.jpg) */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><BsLightbulbFill className="text-yellow-500"/> AI Insight</h3>
              <span className="text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-full">Saran Perbaikan</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Saran perbaikan kalimat agar CV terkesan lebih terukur dan profesional.</p>
            
            <div className="space-y-4">
              {/* Accordion */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => setOpenInsight('profesional')} className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-lg">Pengalaman Kerja</span>
                    <span className="text-sm text-gray-600 hidden sm:block font-medium">Gunakan metrik kuantitatif untuk dampak...</span>
                  </div>
                  {openInsight === 'profesional' ? <FiChevronDown className="text-gray-500"/> : <FiChevronRight className="text-gray-500"/>}
                </button>
                {openInsight === 'profesional' && (
                  <div className="p-6 bg-white space-y-5 border-t border-gray-100">
                    <div className="flex gap-4">
                      <FiXCircle className="text-red-500 shrink-0 mt-1" size={20}/>
                      <div className="bg-red-50 text-red-900 p-3 rounded-xl text-sm italic w-full border border-red-100">
                        "Bertanggung jawab membuat API backend perusahaan"
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <FiCheckCircle className="text-green-500 shrink-0 mt-1" size={20}/>
                      <div className="bg-green-50 text-green-900 p-3 rounded-xl text-sm font-medium w-full border border-green-100">
                        "Merancang dan mengimplementasikan arsitektur REST API backend yang mampu melayani 10.000+ request/hari"
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN (Metrik & Informasi Samping) */}
        {/* ========================================== */}
        <div className="lg:w-1/3 space-y-6">
          
          {/* Card: Analisis Kecocokan (Dari Detail Job.png) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <h3 className="font-bold text-gray-900 mb-6 text-left">Analisis Kecocokan CV</h3>
            <div className="w-40 h-40 mx-auto rounded-full border-[12px] border-gray-50 flex flex-col items-center justify-center relative mb-4">
               {/* Simulasi Circular Progress (Visual Trick dengan border) */}
              <div className="absolute inset-[-12px] rounded-full border-[12px] border-blue-600" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 85%)' }}></div>
              <span className="text-4xl font-black text-gray-900">85<span className="text-xl">%</span></span>
            </div>
            <p className="text-sm text-gray-500 font-medium">2 dari 4 skill utama cocok</p>
          </div>

          {/* Card: Breakdown Skor (Dari Dashboard.jpg) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Breakdown Skor</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2 text-gray-600"><span>Relevansi Skill</span><span className="text-green-500">82%</span></div>
                <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-green-500 w-[82%] h-full rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2 text-gray-600"><span>Pengalaman Kerja</span><span className="text-blue-500">75%</span></div>
                <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-blue-500 w-[75%] h-full rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2 text-gray-600"><span>Kualitas Kalimat</span><span className="text-yellow-500">60%</span></div>
                <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-yellow-500 w-[60%] h-full rounded-full"></div></div>
              </div>
            </div>
          </div>

          {/* Card: Informasi Tambahan (Dari Detail Job.png) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Informasi Tambahan</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 text-sm">
                <span className="text-gray-500 flex items-center gap-2"><FiTrendingUp/> Level</span>
                <span className="font-bold text-gray-900">Mid-Level</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 text-sm">
                <span className="text-gray-500 flex items-center gap-2"><FiBriefcase/> Tim</span>
                <span className="font-bold text-gray-900">Product Tech</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 text-sm">
                <span className="text-gray-500 flex items-center gap-2"><FiInfo/> Pelamar</span>
                <span className="font-bold text-gray-900">18 orang</span>
              </div>
            </div>
          </div>

          {/* Card: Upgrade / Potensi Peningkatan (Dari Dashboard.jpg) */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            {/* Dekorasi BG */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl"></div>
            
            <div className="relative z-10">
              <p className="text-indigo-200 text-sm font-semibold mb-1">Tingkatkan Peluang Anda</p>
              <div className="text-5xl font-black mb-2 flex items-baseline gap-1">+18 <span className="text-lg font-bold text-indigo-200">Poin</span></div>
              <p className="text-xs text-indigo-100 mb-6 leading-relaxed">Jika Anda menerapkan semua saran AI Insight dan melengkapi Skill Gap di editor.</p>
              
              <button onClick={() => navigate('/editor')} className="w-full bg-white text-indigo-700 font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <BsLightbulbFill /> Buka CV Editor
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}