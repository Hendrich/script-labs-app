# Script Labs App

Frontend React + Vite untuk demo QA automation. Project ini dibuat sebagai playground testing seperti mini e-commerce dan CRUD script management untuk portfolio QA.

## Live Setup

```text
Frontend : https://labs.hendri.me
Backend  : https://api-script-labs.hendri.me
Backend repository: https://github.com/Hendrich/script-labs
Database : PostgreSQL di Vultr
Auth     : Supabase Auth untuk fase transisi
```

## Fitur Utama

### Product Shop

- Product catalog dengan tampilan e-commerce
- Search product
- Filter category
- Add to cart
- Update quantity
- Remove item
- Clear cart
- Checkout form
- Checkout success state
- Cart disimpan di localStorage

### Script CRUD

- Tambah script testing
- Edit script testing
- Delete script testing
- List script berdasarkan user login
- Data Script CRUD tersimpan melalui backend API di Vultr

## Tech Stack

- React 18
- Vite
- CSS custom components
- Playwright
- Vercel deployment

## Setup Local Development

```bash
git clone https://github.com/Hendrich/script-labs-app.git
cd script-labs-app/frontend-react
npm install
```

Buat file `.env` di folder `frontend-react`:

```env
VITE_API_URL=https://api-script-labs.hendri.me
```

Jalankan local development:

```bash
npm run dev
```

Aplikasi local berjalan di:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
npm run preview
```

## Testing

```bash
npx playwright install
npm test
npm run test:ui
npm run test:headed
npm run test:report
```

## Struktur Project

```text
script-labs-app/
├── frontend-react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── labs/
│   │   │   ├── shop/
│   │   │   └── common/
│   │   ├── data/
│   │   │   └── products.js
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── constants/
│   │   └── utils/
│   ├── tests/
│   ├── public/
│   └── package.json
└── README.md
```

## Cara Menggunakan

1. Buka `https://labs.hendri.me` atau local dev URL.
2. Register atau login.
3. Gunakan tab **Product Shop** untuk flow e-commerce testing.
4. Gunakan tab **Script CRUD** untuk CRUD script testing.

## API yang Dipakai

```text
POST /api/auth/login
POST /api/auth/register
GET  /api/labs
POST /api/labs
PUT  /api/labs/:id
DELETE /api/labs/:id
GET  /health
```

## Deployment

Frontend dideploy ke Vercel.

Environment variable production di Vercel:

```env
VITE_API_URL=https://api-script-labs.hendri.me
```

## Catatan Arsitektur

- Product Shop saat ini frontend-only dengan static product data dan localStorage cart.
- Script CRUD sudah memakai backend API di Vultr dan PostgreSQL Vultr.
- Login/register masih memakai Supabase Auth untuk fase transisi.

## Roadmap

- [x] Deploy backend ke Vultr
- [x] Gunakan PostgreSQL Vultr untuk Script CRUD
- [x] Tambah Product Shop frontend
- [x] Tambah cart dan checkout frontend-only
- [ ] Tambah products API di backend
- [ ] Tambah checkout dummy API
- [ ] Ganti Supabase Auth ke local/dummy auth
- [ ] Tambah reset test data endpoint
- [ ] Tambah sample automation tests

## License

MIT License.
