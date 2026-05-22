import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUploadCloud, FiEdit2, FiFileText, FiCheckCircle, 
  FiArrowLeft, FiZap, FiTarget, FiRefreshCw, FiShield, FiBriefcase
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill } from 'react-icons/bs';
import { uploadCV } from '../../services/api';

export default function PreLoginFlow() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  
  // Perbaikan: State dipecah seperti di NewAnalysis
  const [pengalaman, setPengalaman] = useState('');
  const [keahlian, setKeahlian] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        setError('Mohon maaf, ukuran file maksimal adalah 1MB untuk menghemat beban server.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    // Validasi berdasarkan Tab Aktif
    if (activeTab === 'upload' && !file) {
      setError('Mohon pilih file CV terlebih dahulu');
      return;
    }

    if (activeTab === 'manual' && (pengalaman.trim().length < 5 || keahlian.trim().length < 5)) {
      setError('Mohon lengkapi data pengalaman dan keahlian Anda.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let apiResult = null;

      if (activeTab === 'upload') {
        apiResult = await uploadCV(file, null);
      } else {
        // Perbaikan: Menggabungkan teks agar terstruktur untuk backend
        const manualData = `Pengalaman Kerja:\n${pengalaman}\n\nDaftar Keahlian:\n${keahlian}`;
        apiResult = await uploadCV(null, manualData);
      }

      // Simpan preview & temp_token ke sessionStorage (Sesi Guest)
      sessionStorage.setItem('guest_cv_result', JSON.stringify({
        ...apiResult.preview,
        temp_token: apiResult.temp_token
      }));
      
      // Lanjut ke halaman hasil analisis
      navigate('/analisis-result'); 

    } catch (err) {
      setError(err.message || 'Gagal memproses profil Anda. Silakan coba lagi.');
      console.error('CV API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logika pengecekan validasi form untuk mematikan tombol
  const isFormValid = activeTab === 'upload' 
    ? !!file 
    : (pengalaman.trim().length >= 5 && keahlian.trim().length >= 5);

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 pb-12">
      
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center py-4 px-6 md:px-12 lg:px-16 border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm mb-8">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><BsStars size={18} /></div>
          ITCareerMatch
        </div>
        <div className="flex items-center gap-4">
          <button type="button" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>
            <FiArrowLeft size={16} /> Batal
          </button>
          <button onClick={() => navigate('/login')} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100 shadow-sm">Masuk</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* --- PAGE TITLE --- */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
            <BsStars size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Analisis CV Instan</h1>
            <p className="text-sm text-gray-500">Cek skor profil Anda sekarang, gratis tanpa registrasi.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* KOLOM KIRI (Area Input Utama) */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
              
              {/* Progress Tracker (Hiasan) */}
              <div className="flex items-center justify-between mb-8 relative hidden sm:flex">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
                <div className="flex items-center gap-2 bg-white pr-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">1</div>
                  <span className="text-sm font-bold text-gray-900">Input Data</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm">2</div>
                  <span className="text-sm font-medium text-gray-400">Scan AI</span>
                </div>
                <div className="flex items-center gap-2 bg-white pl-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
                  <span className="text-sm font-medium text-gray-400">Hasil</span>
                </div>
              </div>

              {/* Toggle Tabs */}
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 mb-8">
                <button 
                  onClick={() => { setActiveTab('upload'); setError(''); }} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === 'upload' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FiUploadCloud size={18}/> Unggah File
                </button>
                <button 
                  onClick={() => { setActiveTab('manual'); setError(''); }} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === 'manual' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FiEdit2 size={18}/> Isi Manual
                </button>
              </div>

              {/* Konten Tab */}
              <div className="mb-8">
                {activeTab === 'upload' ? (
                  <div>
                    <label className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 hover:border-indigo-300 transition-colors cursor-pointer group block">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                        className="hidden"
                      />
                      {file ? (
                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-full max-w-sm cursor-default" onClick={(e) => e.preventDefault()}>
                          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 border border-indigo-100"><FiFileText size={24} /></div>
                          <div className="text-left flex-1 truncate">
                            <p className="font-bold text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-0.5"><FiCheckCircle /> Siap dianalisis</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FiUploadCloud size={32} />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Drag & Drop CV Anda di sini</h3>
                          <p className="text-sm text-gray-500 mb-6">atau klik untuk memilih file</p>
                          <div className="flex gap-3 text-xs font-semibold text-gray-400">
                            <span className="bg-gray-100 px-3 py-1 rounded-md">PDF</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-md">DOCX</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-md">Maks 1MB</span>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Perbaikan: Form manual dipecah jadi 2 area agar sama seperti Dashboard */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Pengalaman Kerja</label>
                      <textarea
                        rows="5"
                        value={pengalaman}
                        onChange={(e) => setPengalaman(e.target.value)}
                        placeholder="Contoh: 3 tahun sebagai Frontend Developer di PT ABC..."
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Daftar Keahlian</label>
                      <textarea
                        rows="3"
                        value={keahlian}
                        onChange={(e) => setKeahlian(e.target.value)}
                        placeholder="Contoh: React, TypeScript, Node.js, Figma..."
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors resize-none"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600 flex items-center gap-2">
                  <FiTarget className="shrink-0" size={18}/> {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || !isFormValid}
                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 cursor-pointer ${loading || !isFormValid ? 'bg-indigo-300 text-white cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}`}
              >
                {loading ? (
                  <><FiRefreshCw className="animate-spin" size={20} /> Memproses Profil Anda...</>
                ) : (
                  <><FiZap size={20} /> Mulai Analisis Instan</>
                )}
              </button>
              <p className="text-center text-xs font-medium text-gray-400 mt-4">
                Tidak ada data yang disimpan secara permanen pada sesi ini.
              </p>

            </div>
          </div>

          {/* KOLOM KANAN (Widget Tambahan) */}
          <div className="lg:w-1/3 space-y-6">
            
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <h3 className="font-bold mb-4 relative z-10 text-lg flex items-center gap-2"><BsStars className="text-yellow-300"/> Yang Anda Dapatkan</h3>
               <ul className="space-y-3.5 text-sm text-indigo-50 relative z-10 font-medium">
                 <li className="flex items-center gap-2.5"><div className="bg-white/20 p-1.5 rounded-lg"><FiZap size={14}/></div> Skor kecocokan instan (0-100)</li>
                 <li className="flex items-center gap-2.5"><div className="bg-white/20 p-1.5 rounded-lg"><FiCheckCircle size={14}/></div> Identifikasi Skill yang Cocok</li>
                 <li className="flex items-center gap-2.5"><div className="bg-white/20 p-1.5 rounded-lg"><FiTarget size={14}/></div> Analisis Skill Gap (Kekurangan)</li>
                 <li className="flex items-center gap-2.5"><div className="bg-white/20 p-1.5 rounded-lg"><FiBriefcase size={14}/></div> Intip Rekomendasi Lowongan</li>
               </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BsLightbulbFill className="text-yellow-500"/> Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-0.5"/> <span>Pastikan CV Anda menggunakan format yang bersih (ATS-Friendly) agar mudah dibaca AI.</span></li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-0.5"/> <span>Gunakan kata kunci (keywords) yang relevan dengan pekerjaan yang Anda tuju.</span></li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex items-start gap-3">
              <FiShield className="text-indigo-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Data Aman & Privat</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Dokumen yang Anda unggah sebagai Guest akan dihapus secara otomatis dan tidak dibagikan ke pihak ketiga.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}} />
    </div>
  );
}