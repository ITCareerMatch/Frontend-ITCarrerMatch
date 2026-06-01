import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiFileText, FiTrash2 } from 'react-icons/fi';
import { fadeInUp, staggerContainer, formatDate } from './helpers';

export default function CvArchive({
  cvArchives,
  onDeleteArchive
}) {
  if (cvArchives.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <FiFileText size={24} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-2">Belum Ada Arsip CV</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          CV yang Anda upload akan tersimpan di sini.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-4"
    >
      {cvArchives.map((archive) => (
        <motion.div
          key={archive.id}
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0">
                <FiFileText size={20} className="text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{archive.file_name || 'CV Document'}</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Diunggah: {formatDate(archive.uploaded_at)}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                    archive.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : archive.status === 'processing'
                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                      : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {archive.status || 'unknown'}
                  </span>
                  <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-100">
                    {archive.cv_source || 'unknown'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onDeleteArchive(archive.id)}
                className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Hapus CV"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}