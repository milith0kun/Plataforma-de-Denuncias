# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Plataforma de Denuncias Ciudadanas** - Full-stack web platform for citizens to report urban problems (potholes, street lighting, sanitation, etc.) with geolocation, photo evidence, and real-time tracking. Built with React + Express + MongoDB.

**Production URL**: https://plataformadenuncias.myvnc.com

## Key Commands

### Development

```bash
# Start both frontend and backend simultaneously (recommended)
npm run dev:full

# Start only frontend (Vite dev server on port 3000)
npm run dev

# Start only backend (Express server on port 5000)
npm run dev:backend

# Or start backend separately
cd Servidor && npm run dev
```

### Database

```bash
# Initialize MongoDB database with default categories and states
npm run init-db

# Verify database connection and collections
npm run verify-db
```

### Testing

```bash
# Run frontend tests (Vitest)
npm test
npm run test:ui          # Run with UI
npm run test:coverage    # Generate coverage report

# Run backend tests (Jest)
npm run test:backend
cd Servidor && npm test
```

### Build & Deployment

```bash
# Build for production
npm run build:prod

# Preview production build
npm preview

# Full production setup (install + build)
npm run setup:production

# Lint code
npm run lint
```

### Jira Integration

```bash
# Verify Jira MCP connection
npm run verify-jira

# Fetch Jira data
npm run fetch-jira
```

## Architecture

### Monorepo Structure

- **Root (`/`)**: Frontend React application (Vite)
- **`Servidor/`**: Backend Express.js API

Both share some dependencies (e.g., `mongoose`) declared at root level for convenience.

### Frontend Architecture

**Framework**: React 19 with Vite (using Rolldown via `rolldown-vite@7.1.14`)

**State Management**:
- **AuthContext** (`src/contexts/AuthContext.jsx`): Global authentication state (user, login, logout, registration)
- **ToastProvider** (`src/components/common/ToastContainer/ToastContainer.jsx`): Global toast notifications
- Local state with `useState`/`useEffect` for component-level state

**Routing**: React Router DOM v7 with role-based protection
- **AppRoutes** (`src/routes/AppRoutes.jsx`): Centralized route definitions
- **PrivateRoute** (`src/routes/PrivateRoute.jsx`): HOC for protecting routes, supports `requireRole` prop
- Routes automatically redirect based on user role (ciudadano → `/home`, autoridad → `/dashboard-autoridad`)

**API Communication**:
- **api.js** (`src/services/api.js`): Axios instance with:
  - Auto-injection of JWT token from localStorage
  - Auto-redirect to `/login` on 401 responses
  - Base URL logic: `VITE_API_URL` env var OR production mode uses `/api/v1` OR defaults to `http://localhost:5000/api/v1`
- Service layer pattern (authService, denunciaService, usuarioService, etc.)

**Key Pages**:
- **Public**: LandingPage, LoginPage, RegisterPage, RegisterAuthorityPage, ForgotPasswordPage, ResetPasswordPage
- **Ciudadano**: HomePage, PerfilPage, DenunciasPage, NuevaDenunciaPage, DetalleDenunciaPage, ReportesPage, SeguimientoDenunciaPage, MapaDenunciasPage
- **Autoridad**: DashboardAutoridadPage, GestionDenunciasPage

**Reusable Components** (`src/components/common/`):
- Alert, Button, Input, Loading, LoadingSkeleton
- Navbar, Header, BottomNavigation, Navigation
- MetricCard, Toast, ToastContainer, Lightbox

### Backend Architecture

**Framework**: Express.js with ES modules (`"type": "module"`)

**Database**: MongoDB Atlas with Mongoose ODM
- Connection: `Servidor/src/config/database.js` - handles connection, reconnection, and graceful shutdown
- Default local: `mongodb://localhost:27017/denuncias_db`

**API Structure**: RESTful API at `/api/v1`
- **Entry**: `Servidor/server.js` → `Servidor/src/app.js`
- **Routes**: `Servidor/src/routes/index.js` aggregates all route modules:
  - `/api/v1/auth` - Authentication (login, register, password reset)
  - `/api/v1/usuarios` - User management
  - `/api/v1/denuncias` - Complaints CRUD
  - `/api/v1/categorias` - Categories
  - `/api/v1/estados` - States
  - `/api/v1/comentarios` - Comments (nested under denuncias or standalone)
  - `/api/v1/estadisticas` - Statistics and analytics

**Authentication**:
- JWT tokens stored in localStorage (frontend) and sent via `Authorization: Bearer <token>` header
- **authMiddleware.js**: Validates JWT, decodes to `req.usuario`
- **roleMiddleware.js**: Checks user role (ciudadano/autoridad)
- Supports both traditional email/password and Google OAuth 2.0

**Data Models** (`Servidor/src/models/`):
- **Usuario**: Users with `id_tipo_usuario` (1=Ciudadano, 2=Autoridad), supports Google OAuth (`google_id`)
- **Denuncia**: Complaints with geolocation (`latitud`, `longitud`), category, state, `area_asignada` (enum), anonymous flag
- **Categoria**: Problem categories (e.g., "Baches", "Alumbrado")
- **EstadoDenuncia**: Complaint states (e.g., "Pendiente", "En Proceso", "Resuelto")
- **HistorialEstado**: State change history with timestamp and user who changed it
- **EvidenciaFoto**: Photo evidence linked to complaints
- **Comentario**: Comments on complaints
- **PasswordResetToken**: Temporary tokens for password recovery

**Controllers** (`Servidor/src/controllers/`):
- Follow MVC pattern: route → controller → model
- Controllers handle request/response, call models for data operations
- Use express-validator for input validation

**Middleware**:
- `authMiddleware.js`: Token verification
- `roleMiddleware.js`: Role-based access control
- `validationMiddleware.js`: Request validation helpers
- `perfilValidations.js`: Profile-specific validations

**File Uploads**:
- Multer for handling multipart/form-data
- Uploads stored in `Servidor/uploads/`
- Served statically at `/uploads`

**CORS Configuration**:
- Production: Reads from `CORS_ORIGINS` env var (defaults to `https://plataformadenuncias.myvnc.com`)
- Development: Allows `localhost:3000`, `localhost:5173`, `localhost:5174`

### Key Architectural Patterns

1. **Role-Based Access Control (RBAC)**:
   - Users have `id_tipo_usuario`: 1 (Ciudadano) or 2 (Autoridad)
   - Frontend: `PrivateRoute` component checks role before rendering
   - Backend: `roleMiddleware` validates role on protected endpoints

2. **State Machine for Complaints**:
   - Denuncias have `id_estado_actual` pointing to EstadoDenuncia
   - State changes are logged in HistorialEstado with timestamp and user
   - Authorities can assign complaints to areas (`area_asignada`) and change states

3. **Geolocation**:
   - Complaints store `latitud`, `longitud`, `direccion_geolocalizada`
   - Frontend uses Leaflet (`react-leaflet`) for maps
   - MapaPicker component for selecting location when creating complaints

4. **Anonymous Complaints**:
   - Denuncias have `es_anonima` boolean flag
   - When true, citizen identity is hidden from public view (but authorities can see it)

5. **Photo Evidence**:
   - Up to 5 photos per complaint
   - EvidenciaFoto model links photos to denuncias
   - Stored as files in `uploads/` with references in database

## Important Environment Variables

### Frontend (`.env` at root)
- `VITE_API_URL`: API base URL (optional, auto-detected)

### Backend (`Servidor/.env`)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for signing JWTs
- `JWT_EXPIRES_IN`: Token expiration in seconds (default: 86400)
- `FRONTEND_URL`: Frontend URL for CORS and redirects
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `EMAIL_*`: SMTP configuration for password reset emails
- `CORS_ORIGINS`: Comma-separated allowed origins

## Design System

### Colors (CSS Variables)
Primary colors defined in `src/App.css` and component CSS files:
- **Primary**: `#153595` (dark blue)
- **Primary Light**: `#A5C1EB` (light blue)
- **Primary Dark**: `#03193B` (navy)
- **Success**: `#10b981` (green)
- **Warning**: `#f59e0b` (amber)
- **Danger**: `#ef4444` (red)
- **Info**: `#3b82f6` (blue)

**IMPORTANT**: Always use CSS variables (e.g., `var(--color-primary)`) instead of hardcoded color values.

### Typography
- **Headings**: DM Serif Text
- **Body/UI**: Montserrat (weights: 300, 400, 500, 700)

### Spacing
- Use multiples of 8px for consistent spacing

### Mobile-First
- Responsive design with breakpoints
- BottomNavigation component for mobile navigation
- Desktop: Full navbar with sidebar

## Code Style

### Frontend
- ESLint configured (`eslint.config.js`)
- React hooks patterns
- Functional components only (no class components)
- CSS Modules for component styles

### Backend
- ES modules (`import/export`)
- Async/await for asynchronous operations
- Express middleware pattern
- Consistent error responses: `{ success: boolean, message: string, data?: any }`

### Commits
- Messages in Spanish
- Descriptive and concise
- Signed with: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

## Testing

### Frontend (Vitest)
- Test setup: `src/tests/setup.js`
- Example: `src/tests/HomePage.test.jsx`
- Run with `npm test`

### Backend (Jest)
- ES modules support via `NODE_OPTIONS=--experimental-vm-modules`
- Example: `Servidor/src/tests/denuncia.test.js`
- Run with `cd Servidor && npm test`

## Common Gotchas

1. **Port conflicts**: Frontend runs on 3000 (not 5173 as typical Vite default - configured in `vite.config.js`)
2. **API URL in production**: Frontend automatically uses `/api/v1` when `MODE=production`, expecting backend at same domain
3. **MongoDB indexes**: Models define indexes - if getting slow queries, check `Servidor/limpiar-indices.js` for cleanup script
4. **Image formats**: Recently converted from PNG to WebP for performance (e.g., `HeroSeccion.webp`, `BAsefooter.webp`)
5. **Geolocation**: MapaPicker component auto-detects user location on load; may need browser permission
6. **Token expiration**: Frontend auto-redirects to login on 401, clearing localStorage

## Branch Strategy

- **main**: Production branch
- **Current branch**: `edmil-saire` (feature branch)
- Create PRs to `main` for production deployment

## Documentation

Extensive documentation in root:
- **INICIO_RAPIDO.md**: Quick start guide
- **VERIFICACION_FINAL.md**: Testing and verification report
- **INFORME_BACKEND.md**: Backend technical documentation (95% complete)
- **INFORME_FRONTEND.md**: Frontend technical documentation (70% complete)
- **INFORME_TESTING.md**: Testing procedures
- **RESULTADOS_TESTS.md**: Detailed test results (17 tests)
- **SPRINT_RESUMEN.md**: Sprint 8 executive summary
- **DEPLOYMENT-CHECKLIST.md**: Deployment checklist
- **QUICKSTART.md**: Deployment guide
- **JIRA_INTEGRATION.md**: Jira MCP integration docs

## Jira Integration

This project uses Jira MCP for task and issue management. Use `npm run verify-jira` to check connection status.
