import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUploadCloud, FiEdit2, FiFileText, FiCheckCircle, FiArrowLeft, FiZap
} from 'react-icons/fi';
import { BsStars, BsArrowRight, BsLightbulbFill } from 'react-icons/bs';
import { uploadCV } from '../../services/api';

export default function PreLoginFlow() {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState('file');
  const [file, setFile] = useState(null);
  const [manualText, setManualText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    setError('');
    setLoading(true);

    try {
      let apiResult = null;

      if (inputType === 'file' && file) {
        // Panggil API dengan File
        apiResult = await uploadCV(file, null);
      } else if (inputType === 'manual' && manualText.trim().length > 10) {
        // Panggil API dengan Teks Manual
        apiResult = await uploadCV(null, manualText);
      } else {
        throw new Error("Mohon unggah file CV atau isi pengalaman minimal 10 karakter.");
      }

      // Simpan preview & temp_token ke sessionStorage
      sessionStorage.setItem('guest_cv_result', JSON.stringify({
        ...apiResult.preview,
        temp_token: apiResult.temp_token
      }));
      
      // Lanjut ke halaman analisis
      navigate('/analisis-result'); 

    } catch (err) {
      setError(err.message || 'Gagal memproses profil Anda. Silakan coba lagi.');
      console.error('CV API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="flex justify-between items-center py-4 px-8 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><BsStars size={18} /></div>
          ITCareerMatch
        </div>
        <button onClick={() => navigate('/login')} className="text-gray-600 font-medium hover:text-blue-600 transition-colors cursor-pointer">Masuk</button>
      </header>

      <div className="max-w-6xl mx-auto py-6 px-6">
        <button type="button" className="flex items-center gap-2 text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-700" onClick={() => navigate('/')}>
          <FiArrowLeft size={18} /> Kembali ke Beranda
        </button>
      </div>

      <main className="max-w-6xl mx-auto py-6 px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-2">
            <BsStars /> Analisis AI dalam 10 detik
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Cek Skor CV-mu Sekarang</h1>
          <p className="text-gray-500">Pilih metode input untuk mendapatkan analisis instan.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* FORM AREA */}
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex bg-gray-50 p-1 rounded-xl mb-8 border border-gray-200">
              <button 
                onClick={() => { setInputType('file'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${inputType === 'file' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}
              >
                <FiUploadCloud size={18} /> Unggah File
              </button>
              <button 
                onClick={() => { setInputType('manual'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${inputType === 'manual' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}
              >
                <FiEdit2 size={18} /> Isi Manual
              </button>
            </div>

            {inputType === 'file' ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center relative mb-8">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,.docx" />
                {file ? (
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm z-10 w-full max-w-sm">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><FiFileText size={24} /></div>
                    <div className="text-left flex-1 truncate">
                      <p className="font-bold text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-green-600 font-semibold flex items-center gap-1"><FiCheckCircle /> Siap dianalisis</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><FiUploadCloud size={28} /></div>
                    <p className="font-bold text-gray-900 mb-1">Drag & Drop CV Anda di sini</p>
                    <p className="text-sm text-gray-500 mb-4">atau klik untuk memilih file PDF</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tuliskan Pengalaman & Keahlian Anda</label>
                  <textarea 
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    rows="6" 
                    placeholder="Contoh: Saya memiliki pengalaman 3 tahun sebagai Frontend Developer. Keahlian saya meliputi React, JavaScript, HTML, CSS..."
                  ></textarea>
                </div>
              </div>
            )}

            {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? <span className="animate-pulse">Memproses Data...</span> : <>Analisis Sekarang <BsArrowRight /></>}
            </button>
          </div>

          {/* INFO PANEL */}
          <div className="lg:w-1/3 space-y-6">
             <div className="bg-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold mb-4">Yang Akan Anda Dapatkan</h3>
              <ul className="space-y-4 text-sm text-purple-100">
                <li className="flex items-center gap-3"><div className="bg-purple-500 p-2 rounded-lg text-white"><FiZap size={16} /></div> Skor Kecocokan (0-100)</li>
                <li className="flex items-center gap-3"><div className="bg-purple-500 p-2 rounded-lg text-white"><FiCheckCircle size={16} /></div> Daftar Skill Cocok</li>
                <li className="flex items-center gap-3"><div className="bg-purple-500 p-2 rounded-lg text-white"><BsStars size={16} /></div> Analisis Skill Gap</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}