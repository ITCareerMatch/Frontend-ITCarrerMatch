# 🎯 ITCareerMatch Frontend

![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0+-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

**ITCareerMatch** adalah platform berbasis kecerdasan buatan (AI) yang berfokus pada analisis dan rekomendasi pekerjaan di bidang Teknologi Informasi (IT). Platform ini memberikan pengalaman terintegrasi bagi pengguna, mulai dari tahap pra-login hingga proses analisis mendalam terhadap kecocokan CV dengan lowongan kerja yang tersedia.

---

## 📋 Deskripsi Proyek

### Tujuan Utama

Membangun platform AI-powered job matching yang membantu求职者 (pencari kerja) di bidang IT menemukan lowongan yang paling sesuai dengan profil dan CV mereka.

### Cakupan Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Landing Page** | Halaman pancingan (hook) yang menarik perhatian pengunjung dengan informasi nilai tambah platform |
| **Sistem AI Scanning** | Pemindaian CV real-time menggunakan teknologi AI untuk analisis kesesuaian |
| **Autentikasi** | Sistem login dan registrasi dengan Supabase Auth |
| **Dashboard Personalized** | Rekomendasi lowongan yang dipersonalisasi berdasarkan profil pengguna |
| **Detail Lowongan** | Informasi lengkap lowongan dengan modul analisis skill gap yang terintegrasi |
| **Chatbot Pendamping** | AI chatbot untuk konsultasi karir dan informasi pasar kerja IT |
| **Riwayat Analisis** | Manajemen dan pencarian riwayat analisis CV |
| **Manajemen CV** | Editor CV internal untuk optimasi konten secara interaktif *(dalam pengembangan)* |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    ITCareerMatch Frontend                     │
│                      (React + Vite + Tailwind)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express.js Backend                       │
│                  (Authentication, API Gateway)               │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │  Supabase  │  │  AI SBERT  │  │   Groq     │
     │ PostgreSQL │  │  Service   │  │ Chatbot/TTS│
     └────────────┘  └────────────┘  └────────────┘
```

### Teknologi Frontend

| Kategori | Teknologi | Fungsi |
|----------|-----------|--------|
| Framework | React.js v18+ | Library utama UI |
| Build Tool | Vite | Development server & bundling |
| Styling | Tailwind CSS v4 | Desain responsif & modern |
| Routing | React Router DOM v7 | Navigasi SPA |
| Animation | Framer Motion | Animasi UI yang smooth |
| State | React Hooks | State management |
| API Client | Native Fetch | Komunikasi dengan backend |
| Auth | Supabase JS | Autentikasi & manajemen user |
| Notifications | SweetAlert2 | Toast notification & dialog |
| Icons | React Icons | Koleksi ikon (Feather, Bootstrap) |

---

## 📁 Struktur Direktori

```
fe-itcareermatch/
├── public/                      # Asset statis
│   └── images/                  # Gambar/logo
├── src/
│   ├── components/              # Komponen reusable
│   │   ├── ui/                  # Komponen UI (Button, Card, dll)
│   │   └── layout/              # Layout components (Navbar, Sidebar, dll)
│   ├── pages/                   # Halaman utama
│   │   ├── LandingPage/         # Landing page
│   │   ├── Login/               # Halaman login
│   │   ├── Register/            # Halaman registrasi
│   │   ├── Dashboard/           # Dashboard user
│   │   ├── Jobs/                # Daftar lowongan
│   │   ├── JobDetail/           # Detail lowongan
│   │   ├── NewAnalysis/         # Analisis CV baru
│   │   ├── AnalysisResult/      # Hasil analisis
│   │   ├── AnalysisHistory/     # Riwayat analisis
│   │   ├── Settings/            # Pengaturan profil
│   │   ├── CvEditor/            # Editor CV (*dalam pengembangan*)
│   │   └── Chatbot/             # Halaman chatbot
│   ├── services/                # Service layer API
│   │   └── api.js               # Konfigurasi API endpoints
│   ├── lib/                     # Library & konfigurasi
│   │   └── supabase.js          # Konfigurasi Supabase client
│   ├── routes/                  # Routing configuration
│   │   └── AppRoutes.jsx        # Definisi route & protected routes
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles (Tailwind)
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Template environment variables
├── .gitignore                  # Git ignore rules
├── index.html                   # HTML entry point
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # Dokumentasi project
```

---

## 🚀 Instalasi & Setup

### Prasyarat

- **Node.js** v18 atau lebih tinggi
- **npm** atau **yarn** sebagai package manager

### Langkah 1: Clone Repository

```bash
# Clone repository
git clone https://github.com/your-org/itcareermatch.git

# Masuk ke direktori frontend
cd itcareermatch/fe-itcareermatch
```

### Langkah 2: Install Dependencies

```bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install
```

### Langkah 3: Setup Environment Variables

Salin file `.env.example` ke `.env` dan sesuaikan dengan konfigurasi Anda:

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi yang sesuai:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application
VITE_APP_NAME=ITCareerMatch
```

### Langkah 4: Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (default Vite).

---

## 🎮 Penggunaan

### Alur Utama Aplikasi

#### 1. Guest Flow (Tanpa Login)
```
Landing Page → Login/Register
                 ↓
          Upload CV (Preview)
                 ↓
         Lihat Hasil Singkat
                 ↓
          Prompt Login/Register
```

#### 2. User Flow (Authenticated)
```
Login/Register → Dashboard
                    ↓
         Upload & Analisis CV
                    ↓
         Lihat Detail Analisis
                    ↓
         Browsing Lowongan
                    ↓
         Lihat Match Score
                    ↓
         Chat dengan AI Bot
```

### Fitur Utama

#### Landing Page
Halaman utama yang menampilkan value proposition platform dan Call-to-Action untuk registrasi.

#### Dashboard
- Profil completeness meter
- Statistik CV
- Rekomendasi lowongan personalized
- Quick access ke fitur utama

#### Analisis CV
1. Upload PDF CV atau masukkan data manual
2. Sistem memproses dan menganalisis
3. Hasil berupa match score, skill gap, dan insight AI

#### Job Detail
- Informasi lengkap lowongan
- Match score dari CV user
- Skill gap analysis
- Tombol apply ke external URL

#### Chatbot
Konsultasi karir dengan AI menggunakan Groq LLM.

---

## 📦 Environment Variables

| Variable | Deskripsi | Required |
|----------|-----------|----------|
| `VITE_API_BASE_URL` | URL backend API | ✅ |
| `VITE_SUPABASE_URL` | URL project Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `VITE_APP_NAME` | Nama aplikasi | ❌ |
| `VITE_APP_ENV` | Environment (development/production) | ❌ |

---

## 📝 API Endpoints

### Endpoints Publik

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/jobs` | Daftar lowongan |
| GET | `/api/v1/jobs/:id` | Detail lowongan |
| POST | `/api/v1/cv/preview` | Preview CV guest |
| POST | `/api/v1/chatbot/chat` | Chat dengan AI |

### Endpoints Terproteksi (Requires Auth)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/user/profile` | Ambil profil user |
| PUT | `/api/v1/user/profile` | Update profil user |
| POST | `/api/v1/cv/analyze` | Analisis CV penuh |
| GET | `/api/v1/cv/archives` | Daftar arsip CV |
| DELETE | `/api/v1/cv/archives/:id` | Hapus arsip CV |
| GET | `/api/v1/jobs/recommendations` | Rekomendasi lowongan |
| GET | `/api/v1/analysis/history` | Riwayat analisis |
| GET | `/api/v1/analysis/:id` | Detail analisis |

---

## 🧪 Available Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview build production |
| `npm run lint` | Running ESLint |

---

## 🔐 Keamanan

- **Autentikasi**: Menggunakan JWT dari Supabase Auth
- **Protected Routes**: Halaman yang memerlukan login akan redirect ke login
- **Environment Variables**: Tidak ada data sensitif yang di-commit ke repository
- **API Calls**: Semua endpoint terproteksi menggunakan Bearer token

---

## 🤝 Kontribusi

### Guidelines

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/your-feature`)
3. Commit perubahan (`git commit -m 'Add feature'`)
4. Push ke branch (`git push origin feature/your-feature`)
5. Buat Pull Request

### Code Standards

- Gunakan ESLint untuk linting
- Ikuti konvensi penamaan React
- Komponen fungsi dengan hooks
- Dokumentasi dengan JSDoc comments

---

## 📚 Dokumentasi Terkait

| Dokumentasi | Lokasi |
|------------|--------|
| Backend API | `/backend/README.md` |
| AI SBERT Service | `/sbert/README.md` |
| Chatbot Service | `/chatbot/README.md` |
| Data Science Pipeline | `/Data-Science-ITCareerMatch/README.md` |

---

## 👥 Tim Pengembang

| Role | Tanggung Jawab |
|------|---------------|
| Frontend Developer | React.js, UI/UX, integrasi API |
| UI/UX Designer | Wireframe, design system |
| Backend Developer | Express.js, API gateway |
| AI Engineer | SBERT model, Chatbot service |
| Data Scientist | Dataset preparation, EDA |

---

## 📄 Lisensi

Proyek ini merupakan bagian dari **Capstone Project - CC26-PSU088**.

MIT License - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---

## 🆘 Dukungan

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Buat issue di repository ini
2. Hubungi tim pengembang melalui repository

---

<p align="center">
  <strong>Dibuat dengan ❤️ untuk komunitas IT Indonesia</strong>
</p>