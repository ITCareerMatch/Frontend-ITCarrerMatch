import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUploadCloud, FiEdit2, FiRefreshCw, FiZap, 
  FiCheckCircle, FiShield, FiFileText, FiTarget, FiBarChart2, FiBriefcase, FiClock, FiPlus,
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill } from 'react-icons/bs';

export default function NewAnalysis() {
  const navigate = useNavigate();
  
  // State untuk Tab (Upload vs Manual)
  const [activeTab, setActiveTab] = useState('upload');
  
  // State untuk efek loading simulasi analisis
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // Simulasi waktu proses analisis AI selama 1.5 detik
    setTimeout(() => {
      setIsAnalyzing(false);
      // Arahkan ke halaman hasil analisis (Hasil Analisis Penuh)
      navigate('/hasil-analisis');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 font-sans text-gray-800">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <BsStars size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Analisis Baru</h1>
          <p className="text-sm text-gray-500">Upload CV baru untuk analisis ulang secara instan</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ========================================== */}
        {/* KOLOM KIRI (Area Input Utama) */}
        {/* ========================================== */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            
            {/* Progress Bar Visual (Statis) */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
              <div className="flex items-center gap-2 bg-white pr-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                <span className="text-sm font-bold text-gray-900">Data CV</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>
                <span className="text-sm font-medium text-gray-400">Analisis AI</span>
              </div>
              <div className="flex items-center gap-2 bg-white pl-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
                <span className="text-sm font-medium text-gray-400">Hasil Penuh</span>
              </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 mb-8">
              <button 
                onClick={() => setActiveTab('upload')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'upload' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FiUploadCloud size={18}/> Unggah File
              </button>
              <button 
                onClick={() => setActiveTab('manual')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'manual' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FiEdit2 size={18}/> Isi Manual
              </button>
            </div>

            {/* Konten Tab */}
            <div className="mb-8">
              {activeTab === 'upload' ? (
                /* AREA DRAG & DROP */
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 hover:border-indigo-300 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FiUploadCloud size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Drag & Drop CV baru di sini</h3>
                  <p className="text-sm text-gray-500 mb-6">atau klik untuk memilih file</p>
                  <div className="flex gap-3 text-xs font-semibold text-gray-400">
                    <span className="bg-gray-100 px-3 py-1 rounded-md">PDF</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-md">DOCX</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-md">Maks 5MB</span>
                  </div>
                </div>
              ) : (
                /* AREA ISI MANUAL */
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Pengalaman Kerja</label>
                    <textarea 
                      rows="5" 
                      placeholder="Contoh: 3 tahun sebagai Frontend Developer di PT ABC..." 
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Daftar Keahlian</label>
                    <textarea 
                      rows="3" 
                      placeholder="Contoh: React, TypeScript, Node.js, Figma..." 
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Mulai Analisis */}
            <button 
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${isAnalyzing ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-200 text-indigo-700 hover:bg-indigo-300'}`}
            >
              {isAnalyzing ? (
                <><FiRefreshCw className="animate-spin" size={20} /> Memproses Analisis AI...</>
              ) : (
                <><FiZap size={20} /> Mulai Analisis Penuh</>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Hasil analisis akan menampilkan seluruh skor dan saran secara lengkap.
            </p>

          </div>
        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN (Widget Tambahan) */}
        {/* ========================================== */}
        <div className="lg:w-1/3 space-y-6">
          
          {/* Scan Terakhir */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Scan Terakhir</h3>
            <p className="text-xs text-gray-500 mb-5">Klik untuk scan ulang dengan CV yang sama</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center border border-green-100"><FiTarget size={18}/></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Backend Engineer (Go)</p>
                    <p className="text-xs text-gray-500">3 Apr 2026 · Skor: 75</p>
                  </div>
                </div>
                <FiRefreshCw className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center border border-yellow-100"><FiTarget size={18}/></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Frontend Developer</p>
                    <p className="text-xs text-gray-500">1 Apr 2026 · Skor: 68</p>
                  </div>
                </div>
                <FiRefreshCw className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center border border-green-100"><FiTarget size={18}/></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Fullstack Engineer</p>
                    <p className="text-xs text-gray-500">28 Mar 2026 · Skor: 72</p>
                  </div>
                </div>
                <FiRefreshCw className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </div>
            </div>
          </div>

          {/* Banner Real-time Scan */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <h3 className="font-bold mb-4 relative z-10">Real-time Scan</h3>
             <ul className="space-y-3 text-sm text-indigo-50 relative z-10">
               <li className="flex items-center gap-2"><FiZap className="text-indigo-200 shrink-0"/> Skor kecocokan instan (0-100)</li>
               <li className="flex items-center gap-2"><FiCheckCircle className="text-indigo-200 shrink-0"/> Skill Match & Gap analysis</li>
               <li className="flex items-center gap-2"><BsStars className="text-indigo-200 shrink-0"/> Saran perbaikan kalimat AI</li>
               <li className="flex items-center gap-2"><FiBriefcase className="text-indigo-200 shrink-0"/> Rekomendasi lowongan baru</li>
             </ul>
          </div>

          {/* Tips */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BsLightbulbFill className="text-yellow-500"/> Tips</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-0.5"/> <span>Pastikan CV Anda menggunakan format yang bersih (ATS-Friendly) agar mudah dibaca AI.</span></li>
              <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-0.5"/> <span>Bandingkan skor Anda dari waktu ke waktu di menu Riwayat.</span></li>
            </ul>
          </div>

          {/* Data Aman */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex items-start gap-3">
            <FiShield className="text-indigo-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">Data Aman</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Semua dokumen CV dienkripsi dan tidak akan dibagikan ke pihak ketiga tanpa izin Anda.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}