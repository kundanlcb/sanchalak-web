# Sanchalak (सञ्चालक) - School Management System

Sanchalak is a modern, centralized School Management System (SMS) designed to bridge the gap between school administration, teaching staff, and parents/students.

## 🚀 Vision
"The Digital Conductor of School Ecosystems"

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: React Context (Auth, Theme, Toast)
- **Routing**: React Router DOM 6
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## ✨ Key Features

### 1. Authentication & RBAC
- Role-Based Access Control (Admin, Teacher, Staff, Student, Parent)
- Dual login support (Email/Password + OTP)
- Secure route protection

### 2. Student Information System (SIS)
- Comprehensive student profiles
- Document management (upload/verify)
- Advanced search and filtering
- Digital admission records

### 3. Digital Attendance
- Class-wise attendance marking
- Optimistic UI for instant feedback
- Parent notifications (simulated)
- Attendance history and stats

### 4. Notice Board
- Priority-based notices (Urgent, High, Medium, Low)
- Targeted audience (All, Students, Teachers, etc.)
- Rich text content support

## 📂 Project Structure

```
src/
├── components/         # Shared UI components
│   ├── common/         # Generic components (Button, Modal, Toast, Skeleton)
│   └── layout/         # Layout components (Header, Sidebar)
├── features/           # Feature-based modules
│   ├── auth/           # Authentication logic & views
│   ├── students/       # Student management
│   ├── attendance/     # Attendance system
│   └── notices/        # Notice board
├── hooks/              # Custom React hooks
├── mocks/              # MSW-style mock data & handlers
├── services/           # API clients & service layers
├── utils/              # Helper functions & constants
└── App.tsx             # Main application entry
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (Mocks enabled by default)
npm run dev
```

### Build for Production

```bash
# Type-check and build
npm run build
```

## ⚙️ Configuration

The application uses `.env` files for configuration.

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_USE_MOCK_API` | Use local mock data service | `true` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080/api` |

## 🧪 Testing

This project emphasizes manual testing and "Independent Checks" defined in the specifications.
Run the app and use the provided mock data to verify scenarios.

## 📝 License
Proprietary - Sanchalak Team
