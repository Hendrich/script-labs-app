# Book Catalog App - Frontend

A modern React application for managing book collections with authentication and CRUD operations.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthContainer.jsx     # Main auth component with tabs
│   │   ├── Login.jsx            # Login form component
│   │   └── Register.jsx         # Registration form component
│   ├── books/
│   │   ├── BookCard.jsx         # Individual book display/edit component
│   │   ├── BookForm.jsx         # Add new book form
│   │   └── BookList.jsx         # Books grid container
│   └── common/
│       ├── ErrorMessage.jsx     # Error display component
│       └── LoadingSpinner.jsx   # Loading indicator component
├── hooks/
│   ├── useAuth.js              # Authentication logic hook
│   └── useBooks.js             # Books CRUD operations hook
├── services/
│   ├── api.js                  # Base API service class
│   ├── authService.js          # Authentication API calls
│   └── bookService.js          # Books API calls
├── constants/
│   └── config.js               # App configuration and API endpoints
├── utils/
│   └── helpers.js              # Utility functions
├── styles/
│   ├── auth.css               # Authentication component styles
│   ├── books.css              # Books component styles
│   └── common.css             # Common component styles
├── App.jsx                     # Main app component
├── Dashboard.jsx               # Main dashboard (books management)
└── main.jsx                    # React entry point
```

## 🚀 Features

- **Authentication**: Login/Register with tabs interface
- **Book Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Centralized error management
- **Loading States**: User feedback during API calls
- **Modern Architecture**: Hooks-based React with service layer

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **Custom Hooks** - For state management
- **Service Layer Architecture** - Clean API abstraction
- **CSS Modules** - Component-scoped styling
- **Environment Variables** - Configuration management

## 📦 Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend-react
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy environment file:
   ```bash
   cp .env.example .env
   ```
5. Update environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Key Components

### Authentication Flow
- `AuthContainer` - Manages login/register tabs
- `Login` & `Register` - Individual form components
- `useAuth` hook - Handles authentication state and API calls

### Books Management
- `Dashboard` - Main books management interface
- `BookForm` - Add new books
- `BookList` - Display books grid
- `BookCard` - Individual book with edit/delete functionality
- `useBooks` hook - Manages books state and CRUD operations

### Service Layer
- `apiService` - Base HTTP client with auth token handling
- `authService` - Authentication-specific API calls
- `bookService` - Books-specific API calls

## 🎨 Styling Architecture

- **App.css** - Global styles and layout
- **styles/auth.css** - Authentication component styles
- **styles/books.css** - Books component styles  
- **styles/common.css** - Shared component styles

## 🔧 Configuration

All configuration is centralized in `src/constants/config.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    AUTH: { LOGIN: '/api/auth/login', REGISTER: '/api/auth/register' },
    BOOKS: { GET_ALL: '/api/books', CREATE: '/api/books', /* ... */ }
  }
};
```

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first CSS approach
- Flexible grid layouts for books
- Touch-friendly buttons and forms
- Responsive navigation

## 🔒 Authentication

- JWT token-based authentication
- Automatic token attachment to API requests
- Persistent login state with localStorage
- Secure logout with token cleanup

## 🚧 Error Handling

- Centralized error management
- User-friendly error messages
- Retry functionality for failed requests
- Loading states for better UX

## 🧪 Best Practices Implemented

- ✅ Component separation and reusability
- ✅ Custom hooks for business logic
- ✅ Service layer for API abstraction
- ✅ Environment-based configuration
- ✅ Consistent error handling
- ✅ Loading states and user feedback
- ✅ Clean file structure and naming
- ✅ CSS organization and modularity
