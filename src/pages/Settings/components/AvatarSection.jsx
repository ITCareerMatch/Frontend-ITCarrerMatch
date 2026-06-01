/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { FiCamera, FiEdit2, FiX, FiRefreshCw, FiZoomIn, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';

/**
 * AvatarSection Component - Avatar upload and crop functionality
 */
export default function AvatarSection({
  avatarUrl,
  onAvatarChange,
  isUploadingAvatar,
  showCropModal,
  selectedImage,
  zoom,
  fileInputRef,
  imgRef,
  onShowCropModal,
  onCloseCropModal,
  onSelectImage,
  onZoomChange,
  onCropConfirm,
  onCancelCrop
}) {
  const [previewUrl, setPreviewUrl] = useState(avatarUrl);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!');
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onSelectImage(file);
      onShowCropModal(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar Preview */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiCamera size={32} className="text-slate-400" />
              </div>
            )}
          </div>
          {isUploadingAvatar && (
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
              <FiRefreshCw className="text-white animate-spin" size={24} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 mb-1">Foto Profil</h3>
          <p className="text-xs text-slate-500 mb-3">Unggah foto profesional untuk profil Anda</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <FiUploadCloud size={16} />
            {previewUrl ? 'Ganti Foto' : 'Unggah Foto'}
          </button>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && selectedImage && createPortal && (
        <CropModal
          image={selectedImage}
          zoom={zoom}
          onZoomChange={onZoomChange}
          onConfirm={() => onCropConfirm(previewUrl)}
          onCancel={onCancelCrop}
          imgRef={imgRef}
        />
      )}
    </div>
  );
}

// Simple crop modal placeholder (full implementation would need react-image-crop or similar)
function CropModal({ image, zoom, onZoomChange, onConfirm, onCancel, imgRef }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Sesuaikan Foto</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <FiX size={24} />
          </button>
        </div>

        {/* Image Preview Area */}
        <div className="bg-slate-100 rounded-xl h-48 mb-4 overflow-hidden flex items-center justify-center">
          <span className="text-slate-400 text-sm">Preview Foto</span>
        </div>

        {/* Zoom Control */}
        <div className="flex items-center gap-3 mb-4">
          <FiZoomIn size={18} className="text-slate-400" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-slate-500 w-8">{zoom.toFixed(1)}x</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiCheckCircle size={16} />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}