import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUploadCloud, FiEdit2, FiFileText, FiCheckCircle, FiLock, 
  FiZap, FiShield, FiClock, FiMessageCircle, FiBriefcase, FiXCircle, FiTrendingUp
} from 'react-icons/fi';
import { BsStars, BsArrowRight, BsLightbulbFill } from 'react-icons/bs';

export default function PreLoginFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); 
  const [inputType, setInputType] = useState('file'); 
  const [file, setFile] = useState(null);
  
  // Handle File Upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle Submit
  const handleAnalyze = () => {
    setStep('loading');
    setTimeout(() => {
      setStep('result');
    }, 2500); 
  };

  // --- TAMPILAN 1: FORM INPUT ---
  if (step === 'input' || step === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
        <header className="flex justify-between items-center py-4 px-8 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><BsStars size={18} /></div>
            ITCareerMatch
          </div>
          <button onClick={() => navigate('/login')} className="text-gray-600 font-medium hover:text-blue-600 transition-colors">Masuk</button>
        </header>

        <main className="max-w-6xl mx-auto py-10 px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-2">
              <BsStars /> Analisis AI dalam 10 detik
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Cek Skor CV-mu Sekarang</h1>
            <p className="text-gray-500">Upload CV Anda untuk mendapatkan analisis AI</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Kiri: Form Area */}
            <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              
              {/* Tabs: File / Manual */}
              <div className="flex bg-gray-50 p-1 rounded-xl mb-8 border border-gray-200">
                <button 
                  onClick={() => setInputType('file')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${inputType === 'file' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}
                >
                  <FiUploadCloud size={18} /> Unggah File
                </button>
                <button 
                  onClick={() => setInputType('manual')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${inputType === 'manual' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}
                >
                  <FiEdit2 size={18} /> Isi Manual
                </button>
              </div>

              {/* Area Input Dinamis */}
              {inputType === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative mb-8">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,.docx" />
                  {file ? (
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm z-10">
                      <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><FiFileText size={24} /></div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900">{file.name}</p>
                        <p className="text-xs text-green-600 font-semibold flex items-center gap-1"><FiCheckCircle /> Siap dianalisis</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><FiUploadCloud size={28} /></div>
                      <p className="font-bold text-gray-900 mb-1">Drag & Drop CV Anda di sini</p>
                      <p className="text-sm text-gray-500 mb-4">atau klik untuk memilih file</p>
                      <div className="flex gap-2 text-xs text-gray-400 font-medium">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">PDF</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">DOCX</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">Maks 5MB</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pengalaman Kerja</label>
                    <textarea className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows="4" placeholder="Contoh: 3 tahun sebagai Frontend Developer di PT ABC..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Daftar Keahlian</label>
                    <textarea className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Contoh: React, TypeScript, Node.js, Figma..."></textarea>
                  </div>
                </div>
              )}

              {/* Tombol Submit*/}
              <button 
                onClick={handleAnalyze}
                disabled={(!file && inputType === 'file') || step === 'loading'}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
              >
                {step === 'loading' ? (
                  <span className="animate-pulse">AI sedang menganalisis CV Anda...</span>
                ) : (
                  <>Analisis CV Sekarang <BsArrowRight /></>
                )}
              </button>
            </div>

            {/* Kanan: Info Panel */}
            <div className="lg:w-1/3 space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BsLightbulbFill className="text-yellow-500" /> Tips untuk Hasil Terbaik</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 mt-0.5 shrink-0" /> Pastikan CV dalam format PDF atau DOCX</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 mt-0.5 shrink-0" /> Cantumkan skill secara spesifik</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 mt-0.5 shrink-0" /> Sertakan pencapaian terukur (angka & metrik)</li>
                </ul>
              </div>

              <div className="bg-purple-600 text-white rounded-2xl p-6 shadow-lg shadow-purple-200">
                <h3 className="font-bold mb-4">Yang Akan Anda Dapatkan</h3>
                <ul className="space-y-4 text-sm text-purple-100">
                  <li className="flex items-center gap-3"><div className="bg-purple-500 p-2 rounded-lg text-white"><FiZap size={16} /></div> Skor Kecocokan CV (0-100)</li>
                  <li className="flex items-center gap-3"><div className="bg-purple-500 p-2 rounded-lg text-white"><FiCheckCircle size={16} /></div> Daftar Skill yang Cocok</li>
                  <li className="flex items-center gap-3"><div className="bg-purple-500 p-2 rounded-lg text-white"><FiFileText size={16} /></div> Analisis Skill Gap</li>
                  <li className="flex items-center gap-3"><div className="bg-purple-500 p-2 rounded-lg text-white"><BsStars size={16} /></div> Saran Perbaikan AI</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- TAMPILAN 2: HASIL ANALISIS (TERKUNCI) ---
  if (step === 'result') {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
        <header className="flex justify-between items-center py-4 px-8 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><BsStars size={18} /></div>
            ITCareerMatch
          </div>
        </header>

        <main className="max-w-5xl mx-auto py-10 px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-2">
              <BsStars /> Hasil Analisis AI
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Skor Kecocokan CV Anda</h1>
            <p className="text-gray-500">Berikut ringkasan hasil scan AI terhadap CV Anda</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Kiri: Skor Ringkasan */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center mb-6">
                <div className="w-40 h-40 mx-auto rounded-full border-8 border-orange-400 flex flex-col items-center justify-center mb-6 relative">
                  <div className="absolute inset-[-8px] rounded-full border-8 border-gray-100 -z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                  <span className="text-5xl font-black text-gray-900 leading-none">70</span>
                  <span className="text-sm text-gray-500">dari 100</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-bold mb-4">
                  <FiTrendingUp /> Cukup Baik
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  CV Anda memiliki potensi yang baik. Daftar untuk membuka saran perbaikan lengkap.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">5</div>
                  <div className="text-xs text-gray-500 font-medium">Skill Cocok</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="text-3xl font-bold text-red-500 mb-1">3</div>
                  <div className="text-xs text-gray-500 font-medium">Skill Gap</div>
                </div>
              </div>
            </div>

            {/* Kanan: List Analisis Terkunci */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <FiLock /> Analisis lengkap terkunci — daftar gratis untuk membuka
                </div>
                
                <div className="divide-y divide-gray-100">
                  {/* List Item 1 */}
                  <div className="p-6 flex items-start gap-4">
                    <div className="mt-1 bg-green-50 text-green-500 p-2 rounded-full"><FiCheckCircle size={20} /></div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">Skill Match</h4>
                      <p className="text-sm text-gray-500 mb-2">5 keahlian Anda terdeteksi dengan baik</p>
                      <p className="text-sm text-gray-300 bg-gray-100 select-none inline-block rounded">Golang, REST API, PostgreSQL, ...</p>
                    </div>
                    <FiLock className="text-gray-300" />
                  </div>

                  {/* List Item 2 */}
                  <div className="p-6 flex items-start gap-4">
                    <div className="mt-1 bg-red-50 text-red-500 p-2 rounded-full"><FiXCircle size={20} /></div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">Skill Gap</h4>
                      <p className="text-sm text-gray-500 mb-2">3 area yang perlu ditingkatkan</p>
                      <p className="text-sm text-gray-300 bg-gray-100 select-none inline-block rounded">Kubernetes, gRPC, CI/CD Pipeline</p>
                    </div>
                    <FiLock className="text-gray-300" />
                  </div>

                  {/* List Item 3 */}
                  <div className="p-6 flex items-start gap-4">
                    <div className="mt-1 bg-yellow-50 text-yellow-500 p-2 rounded-full"><BsLightbulbFill size={20} /></div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">AI Insight</h4>
                      <p className="text-sm text-gray-500 mb-2">3 saran perbaikan kalimat untuk CV lebih profesional</p>
                      <p className="text-sm text-gray-300 bg-gray-100 select-none inline-block rounded">"Merancang dan mengimplementasi..."</p>
                    </div>
                    <FiLock className="text-gray-300" />
                  </div>
                </div>
              </div>

              {/* CTA Banner */}
              <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
                <div className="mb-6 md:mb-0 md:pr-8">
                  <h3 className="text-xl font-bold mb-2">Buka Analisis Lengkap — Gratis!</h3>
                  <p className="text-blue-100 text-sm">Daftar dalam 30 detik untuk melihat detail Skill Match, Gap, saran AI, dan lowongan yang cocok.</p>
                </div>
                <button 
                  onClick={() => navigate('/register')}
                  className="w-full md:w-auto bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
                >
                  Daftar Gratis <BsArrowRight />
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}