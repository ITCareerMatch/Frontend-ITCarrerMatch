import React from 'react';
import { FiBell } from 'react-icons/fi';

/**
 * ToggleSwitch Component - Reusable toggle button
 */
const ToggleSwitch = ({ active, onClick }) => (
  <div
    onClick={onClick}
    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${active ? 'bg-blue-600' : 'bg-slate-200'}`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${
        active ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </div>
);

/**
 * NotificationSection Component - Notification preferences
 */
export default function NotificationSection({
  notifState,
  onToggleNotification
}) {
  const notifications = [
    { key: 'jobMatch', label: 'Lowongan Baru', desc: 'Notifikasi saat ada lowongan yang cocok' },
    { key: 'tips', label: 'Tips & Tricks', desc: 'Tips优化简历 dan pekerjaan' },
    { key: 'updates', label: 'Pembaruan Sistem', desc: 'Informasi fitur baru dan maintenance' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FiBell size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Notifikasi</h3>
            <p className="text-xs text-slate-500 mt-0.5">Pengaturan pemberitahuan</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100">
        {notifications.map((notif) => (
          <div key={notif.key} className="p-5 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 text-sm">{notif.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{notif.desc}</p>
            </div>
            <ToggleSwitch
              active={notifState[notif.key]}
              onClick={() => onToggleNotification(notif.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}