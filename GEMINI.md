# Comprehensive Analysis of the Urban Problem Reporting Web Platform

## Project Overview

This is a full-stack web application for citizens to report urban problems. The platform allows users to submit complaints with geolocation and photographic evidence, and for authorities to manage and track these complaints in real time.

**Frontend:**
- React 18+ with Hooks
- React Router DOM v6 for routing
- Context API for state management
- Axios for HTTP requests
- Vite as a build tool
- CSS Modules for modular styles

**Backend:**
- Node.js with Express.js
- MongoDB Atlas as the database
- Mongoose as the ODM for MongoDB
- JWT for authentication
- Bcrypt for password hashing
- Express-validator for validations
- Multer for file uploads

# Building and Running

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation and Execution

### Full Stack (Frontend and Backend)

To run the entire application (both frontend and backend) in development mode, use the following command from the root of the project:

```bash
npm run dev:full
```

This will start the frontend on `http://localhost:5173` and the backend on `http://localhost:5000`.

### Frontend Only

To run only the frontend in development mode, use the following command from the root of the project:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Backend Only

To run only the backend in development mode, first navigate to the `Servidor` directory and then run the development script:

```bash
cd Servidor
npm run dev
```

The server will be available at `http://localhost:5000`.

## Building for Production

To build the frontend for production, run the following command from the root of the project:

```bash
npm run build
```

This will create a `dist` folder with the production-ready files.

# Testing

## Frontend

To run the frontend tests, use the following command from the root of the project:

```bash
npm test
```

To run the frontend tests with a UI, use:

```bash
npm run test:ui
```

## Backend

To run the backend tests, first navigate to the `Servidor` directory and then run the test script:

```bash
cd Servidor
npm test
```

# Development Conventions

- **Code Style:** The project uses ESLint to enforce a consistent code style. You can run the linter with `npm run lint`.
- **Commits:** Commit messages should be descriptive and written in Spanish.
- **CSS:** The project uses CSS Modules for styling, and developers should use the defined CSS variables instead of hardcoded values.
- **Branching:** When adding a new feature, create a new branch from `main` with the name `feature/new-feature`.