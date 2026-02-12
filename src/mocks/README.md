# Mock Data Structure

This directory contains JSON mock data files for API responses during development.

## Directory Structure

```
src/mocks/
├── data/                  # JSON data files
│   ├── users.json
│   ├── roles.json
│   ├── students.json
│   ├── classes.json
│   ├── documents.json
│   ├── attendance.json
│   └── notices.json
└── handlers/              # Mock API handlers
    ├── authHandlers.ts
    ├── studentHandlers.ts
    ├── attendanceHandlers.ts
    └── noticeHandlers.ts
```

## Usage

Mock handlers simulate realistic API delays (200-500ms) and occasional errors (5% failure rate) to match production behavior.

Enable/disable mock mode via `.env.local`:
```
VITE_USE_MOCK_API=true
```
