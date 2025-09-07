# 🧪 Script Labs

> Platform modern untuk QA testing dan eksperimen skrip, dibangun menggunakan React + Vite

![Script Labs Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-4.0.0-646CFF)

## ✨ Fitur Utama

- 🔐 **Sistem Autentikasi** - Login & Register yang aman
- 🧪 **Manajemen Script Labs** - Tambah, edit, hapus, dan lihat koleksi script testing
- 🎨 **UI/UX Modern** - Interface yang clean dan responsif dengan tema labs
- 🚀 **Performance Optimal** - Dibangun dengan Vite untuk loading yang cepat
- 🧪 **Testing Ready** - Dilengkapi dengan Playwright untuk end-to-end testing

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Build Tool**: Vite 4.0.0
- **Testing**: Playwright
- **Styling**: CSS3 dengan custom components
- **Deployment**: Vercel

## 📋 Prerequisites

Pastikan Anda memiliki software berikut terinstall:

- [Node.js](https://nodejs.org/) (versi 16 atau lebih baru)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- Git

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Hendrich/script-labs-app.git
cd script-labs-app
```

### 2. Install Dependencies

```bash
cd frontend-react
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di dalam folder `frontend-react`:

```env
VITE_API_URL=http://localhost:5000
```

> **Note**: Sesuaikan URL API dengan backend server Anda

## 🏃‍♂️ Cara Menjalankan

### Development Mode

```bash
cd frontend-react
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Production Build

```bash
cd frontend-react
npm run build
npm run preview
```

### Testing

```bash
# Run all tests
npm test

# Run tests dengan UI
npm run test:ui

# Run tests dengan browser tampil
npm run test:headed

# Lihat test report
npm run test:report
```

## 📁 Struktur Proyek

```
script-labs-app/
├── frontend-react/
│   ├── src/
│   │   ├── components/          # Komponen React
│   │   │   ├── auth/           # Komponen autentikasi
│   │   │   ├── labs/           # Komponen manajemen script labs
│   │   │   └── common/         # Komponen umum
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API services
│   │   ├── styles/             # CSS files
│   │   ├── constants/          # Konfigurasi & konstanta
│   │   └── utils/              # Utility functions
│   ├── tests/                  # Playwright tests
│   ├── public/                 # Static assets
│   └── package.json
└── README.md
```

## 🎯 Penggunaan

### 1. Registrasi/Login

- Buka aplikasi di browser
- Klik "Register" untuk membuat akun baru atau "Login" jika sudah punya akun
- Masukkan email dan password

### 2. Manajemen Script Labs

- **Tambah Script**: Klik tombol "Add Script" dan isi form
- **Edit Script**: Klik tombol edit pada kartu script
- **Hapus Script**: Klik tombol delete (akan ada konfirmasi)
- **Lihat Detail**: Klik pada kartu script untuk melihat detail

## 🧪 Testing

Aplikasi ini menggunakan Playwright untuk end-to-end testing:

```bash
# install driver browser type terlebih dahulu
npx playwright install
# Test autentikasi
npm test -- auth

# Test manajemen script labs
npm test -- labs

# Test specific file
npm test -- edit-lab.spec.js
```

## 🚢 Deployment

Aplikasi ini sudah dikonfigurasi untuk deploy ke Vercel:

1. Fork repository ini
2. Connect ke Vercel account Anda
3. Deploy otomatis akan berjalan setiap push ke main branch

## 📝 API Endpoints

Aplikasi ini mengharapkan backend API dengan endpoints berikut:

```
POST /api/auth/login          # Login user
POST /api/auth/register       # Register user
GET  /api/labs               # Get all script labs
POST /api/labs               # Create new script lab
PUT  /api/labs/:id           # Update script lab
DELETE /api/labs/:id         # Delete script lab
```

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
