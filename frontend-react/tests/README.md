# E2E Testing untuk Script Labs dengan Playwright

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Menjalankan Tests

### Semua Tests

```bash
npm test
```

### Tests dengan UI Mode (Recommended untuk debugging)

```bash
npm run test:ui
```

### Tests dengan browser terlihat

```bash
npm run test:headed
```

### Menjalankan test spesifik

```bash
npx playwright test auth/login.spec.js
npx playwright test labs/add-script.spec.js
```

### Menjalankan test untuk browser spesifik

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

## Test Report

Setelah test selesai, lihat report:

```bash
npm run test:report
```

## Test Structure

```
tests/
├── helpers.js                      # Helper functions dan constants
├── auth/
│   ├── login.spec.js               # Login functionality tests
│   └── auth-flow.spec.js           # Authentication flow tests
├── labs/
│   ├── add-script.spec.js          # Add script tests
│   ├── script-list.spec.js         # Script listing tests
│   ├── edit-script.spec.js         # Edit script tests
│   └── delete-script.spec.js       # Delete script tests
├── ui/
│   ├── responsive.spec.js          # Responsive design tests
│   └── navigation.spec.js          # Navigation & interaction tests
├── error-handling/
│   └── error-states.spec.js        # Error handling tests
└── integration/
    └── user-journey.spec.js        # Full user journey tests
```

## Test Credentials

Tests menggunakan kredensial static:

- Email: `dhanjoenkp@gmail.com`
- Password: `qweqwe`

## Prerequisites

Pastikan backend berjalan di `localhost:3000` sebelum menjalankan tests.

## Test Coverage

### Authentication (8 tests)

- ✅ Login dengan kredensial valid
- ✅ Error handling untuk kredensial invalid
- ✅ Validasi form
- ✅ Loading states
- ✅ Session persistence
- ✅ Logout functionality

### Script Labs Management (32+ tests)

- ✅ Add new script
- ✅ View script list
- ✅ Edit existing script
- ✅ Delete script with confirmation
- ✅ Form validation
- ✅ Loading states

### UI/UX (12+ tests)

- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Navigation consistency
- ✅ Form interactions
- ✅ Accessibility features

### Error Handling (16+ tests)

- ✅ Form validation errors
- ✅ Network error handling
- ✅ Error message display
- ✅ Error recovery

### Integration (10+ tests)

- ✅ Complete user journey
- ✅ Data consistency
- ✅ State management
- ✅ Cross-operation reliability

**Total: 78+ Test Cases**

## Debugging

1. Use `--headed` mode untuk melihat browser
2. Use `--debug` untuk step-by-step debugging
3. Screenshots otomatis disimpan untuk test yang gagal
4. Video recording untuk test yang gagal

## Configuration

Lihat `playwright.config.js` untuk konfigurasi:

- Multiple browsers (Chrome, Firefox, Safari)
- Mobile testing (iPhone, Android)
- Screenshot & video recording
- Test timeout settings
