# Frontend React (Book Catalog App)

## Development

- Jalankan backend di `localhost:3000`
- Jalankan frontend React di folder ini:
  ```bash
  npm install
  npm run dev
  ```
- Website akan berjalan di `http://localhost:5173`
- Semua request `/api/*` otomatis di-proxy ke backend

## Struktur

- `src/` : Source code React
- `.env` : Konfigurasi base URL API
- `vite.config.js` : Proxy dan port

## Fitur

- Login/Register
- Dashboard buku
- Integrasi API backend

---

Untuk migrasi logic dari script.js lama, buat komponen React sesuai flow login/register dan dashboard buku.
