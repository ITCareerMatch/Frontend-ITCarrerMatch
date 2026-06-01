// Konfigurasi animasi seragam
export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

// Helper: Format date
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper: Get score badge
export const getScoreBadge = (score) => {
  if (score >= 80) return { label: 'Sangat Baik', color: 'emerald' };
  if (score >= 60) return { label: 'Cukup', color: 'amber' };
  return { label: 'Optimasi', color: 'rose' };
};