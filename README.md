#  MERN Bug Tracker

A full-stack bug tracking application built with MongoDB, Express.js, React, and Node.js (MERN stack). This project demonstrates comprehensive testing, debugging, and error handling practices for both frontend and backend development.

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Debugging](#debugging)
- [Error Handling](#error-handling)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

##  Features

- **Create, Read, Update, Delete (CRUD)** operations for bug reports
- **Filter and sort** bugs by status, severity, and other criteria
- **Real-time statistics** dashboard
- **Responsive UI** built with React and TailwindCSS
- **Comprehensive testing** with Jest and React Testing Library
- **Error boundaries** for graceful error handling
- **Input validation** on both client and server
- **RESTful API** with proper error handling middleware

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Jest & Supertest (testing)

### Frontend
- React 18
- React Router v6
- Axios
- TailwindCSS
- Vite
- Vitest & React Testing Library (testing)

##  Project Structure
```
mern-bug-tracker/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Error handling middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── tests/           # Backend tests
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── tests/       # Frontend tests
│   │   ├── utils/       # Helper functions
│   │   └── App.jsx      # Main app component
│   └── vite.config.js   # Vite configuration
└── README.md
```

##  Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd mern-bug-tracker
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/bug-tracker
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:5000/api" 
```

### Step 4: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongodb
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on `https://bug-tracker-backend-2z4i.onrender.com/api`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on `https://deployment-and-devops-essentials-moen.onrender.com/api`

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

##  Testing

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage Includes:**
- API endpoint integration tests
- Validation utility unit tests
- Error handling tests
- Database operation tests

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Test Coverage Includes:**
- Component rendering tests
- User interaction tests
- Form validation tests
- Service/API call tests

##  Debugging

### Backend Debugging

#### Using Node.js Inspector

1. **Start server in debug mode:**
```bash
   node --inspect server.js
```

2. **Open Chrome DevTools:**
   - Navigate to `chrome://inspect`
   - Click "Open dedicated DevTools for Node"

3. **Set breakpoints** in your code or use `debugger` statement

#### Using VS Code Debugger

Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/server.js",
      "envFile": "${workspaceFolder}/backend/.env"
    }
  ]
}
```

#### Console Logging

The application includes strategic `console.log` statements:
-  Server startup
-  Successful operations
-  Errors
-  Data fetching
-  Bug-related operations

### Frontend Debugging

#### Using Chrome DevTools

1. **Open DevTools** (F12 or Right-click → Inspect)
2. **Sources Tab:** Set breakpoints in React components
3. **Console Tab:** View logs and errors
4. **Network Tab:** Monitor API requests
5. **React DevTools:** Install extension for component inspection

#### React Error Boundaries

The app includes an Error Boundary component that catches React component errors and displays user-friendly messages with error details in development mode.

##  Error Handling

### Backend Error Handling

**Global Error Middleware** (`errorMiddleware.js`):
- Catches all errors from routes and controllers
- Formats error responses consistently
- Logs errors for debugging
- Handles specific error types (Validation, CastError, etc.)

**Example Error Response:**
```json
{
  "success": false,
  "message": "Bug not found",
  "stack": "..." // Only in development
}
```

### Frontend Error Handling

**Error Boundary:**
- Catches React component errors
- Prevents entire app crashes
- Shows fallback UI with error details

**API Error Handling:**
- Axios interceptors catch all API errors
- User-friendly error messages
- Retry functionality for failed requests

**Form Validation:**
- Client-side validation before submission
- Real-time feedback on input errors
- Character count displays

##  API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Get All Bugs
```http
GET /bugs
Query Parameters:
  - status: string (optional)
  - severity: string (optional)
  - sortBy: string (default: '-createdAt')
```

#### Get Single Bug
```http
GET /bugs/:id
```

#### Create Bug
```http
POST /bugs
Body:
{
  "title": "string (required)",
  "description": "string (required)",
  "severity": "low|medium|high|critical",
  "status": "open|in-progress|resolved|closed",
  "assignedTo": "string",
  "priority": number (1-5),
  "reproducible": boolean,
  "tags": ["string"]
}
```

#### Update Bug
```http
PUT /bugs/:id
Body: Same as Create Bug (all fields optional)
```

#### Delete Bug
```http
DELETE /bugs/:id
```

#### Get Statistics
```http
GET /bugs/stats
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

##  Key Features Demonstrated

### Testing Best Practices
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests with React Testing Library
- Mocking external dependencies
- Test coverage reporting

### Debugging Techniques
- Strategic console logging
- Breakpoint debugging
- Chrome DevTools usage
- Node.js Inspector
- Error stack traces

### Error Handling Patterns
- Try-catch blocks
- Error middleware
- Error boundaries
- Input validation
- Graceful degradation

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License.

##  Author

Created as a comprehensive demonstration of MERN stack development with emphasis on testing, debugging, and error handling.

##  Acknowledgments

- MongoDB Documentation
- Express.js Documentation
- React Documentation
- Jest Documentation
- Testing Library Documentation

---
# CI/CD Pipeline

This project uses GitHub Actions for continuous integration and Render for continuous deployment.
Workflows
Frontend CI (frontend-ci.yml)

 Runs on push/PR to main/develop
 ESLint code linting
 Vitest unit & integration tests
 Coverage reporting to Codecov
 Production build validation
 Security audit with npm audit

Backend CI (backend-ci.yml)

 Runs on push/PR to main/develop
 MongoDB service container for testing
 Jest unit & integration tests
 Coverage reporting to Codecov
 Security audit with npm audit

Frontend CD (frontend-cd.yml)

 Deploys to Render on push to main
 Health checks with retry logic
 Route testing after deployment
 Slack notifications
 PR comments with deployment URLs

Backend CD (backend-cd.yml)

 Deploys to Render on push to main
 Health checks with 15 retry attempts
 API endpoint testing
 Deployment notifications
 Display health information

E2E Tests (e2e-tests.yml)

 Full production smoke tests
 Complete CRUD lifecycle testing
 CORS configuration verification
 Performance monitoring
 Runs daily at 6 AM UTC
 Can be triggered manually