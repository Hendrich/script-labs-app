# 📚 Book Catalog App

> Aplikasi katalog buku modern dengan sistem autentikasi, dibangun menggunakan React + Vite

![Book Catalog Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-4.0.0-646CFF)

## ✨ Fitur Utama

- 🔐 **Sistem Autentikasi** - Login & Register yang aman
- 📖 **Manajemen Buku** - Tambah, edit, hapus, dan lihat koleksi buku
- 🎨 **UI/UX Modern** - Interface yang clean dan responsif
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
git clone https://github.com/Hendrich/book-catalog-app.git
cd book-catalog-app
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
book-catalog-app/
├── frontend-react/
│   ├── src/
│   │   ├── components/          # Komponen React
│   │   │   ├── auth/           # Komponen autentikasi
│   │   │   ├── books/          # Komponen manajemen buku
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

### 2. Manajemen Buku

- **Tambah Buku**: Klik tombol "Add Book" dan isi form
- **Edit Buku**: Klik tombol edit pada kartu buku
- **Hapus Buku**: Klik tombol delete (akan ada konfirmasi)
- **Lihat Detail**: Klik pada kartu buku untuk melihat detail

## 🧪 Testing

Aplikasi ini menggunakan Playwright untuk end-to-end testing:

```bash
# install driver browser type terlebih dahulu
npx playwright install
# Test autentikasi
npm test -- auth

# Test manajemen buku
npm test -- books

# Test specific file
npm test -- edit-book.spec.js
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
GET  /api/books              # Get all books
POST /api/books              # Create new book
PUT  /api/books/:id          # Update book
DELETE /api/books/:id        # Delete book
```
