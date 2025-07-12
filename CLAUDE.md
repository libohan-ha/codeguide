# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This repository contains a full-stack application for generating project development documents using AI:

- **Root directory**: Contains AI configuration (`ai.py`) and documentation
- **vibeguide-frontend/**: React + TypeScript + Vite frontend application

### Frontend Architecture

The frontend is a modern React application with the following key architectural components:

- **State Management**: Zustand with Immer middleware for immutable state updates, persistence, and devtools
- **Routing**: React Router DOM for navigation
- **Styling**: Tailwind CSS with custom design tokens
- **AI Integration**: Mock AI service with plans for real Gemini API integration
- **Document Generation**: Multi-step workflow for project analysis and document creation

### Key State Structure

The application uses a centralized Zustand store (`src/store/index.ts`) with:
- Project data management (description, requirements, AI questions, generated documents)
- Multi-step workflow state (1: Description → 2: AI Questions → 3: Document Generation)
- Notification system
- Loading and error states with granular control
- Persistent storage for projects and settings

### Component Organization

- **pages/**: Main application views (LandingPage, CreateProject, StepperDemo)
- **components/**: Organized by feature and type:
  - `forms/`: Input forms for each workflow step
  - `project/`: Step-specific components (ProjectStep1, ProjectStep2, ProjectStep3)
  - `documents/`: Document viewing and management
  - `ui/`: Reusable UI components with consistent design
  - `layout/`: Application shell and navigation
- **services/**: AI and document generation services
- **hooks/**: Custom React hooks for animations and form management

## Development Commands

```bash
cd vibeguide-frontend

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## AI Integration

The application now supports both mock and real AI services using DeepSeek API:

### Backend API (Python Flask)
- **File**: `backend_api.py` - Flask REST API server
- **AI Provider**: DeepSeek Chat API
- **Model**: `deepseek-chat`
- **Dependencies**: Listed in `requirements.txt`
- **Virtual Environment**: Use `venv/` directory

### Frontend Integration
- **Service**: `src/services/aiService.ts` - Intelligent fallback system
- **Environment**: Use `VITE_USE_REAL_AI=true` to enable real AI
- **Fallback**: Automatically falls back to mock data if API fails

### API Endpoints
- `POST /api/ai/generate-questions` - Generate analysis questions
- `POST /api/ai/analyze-answers` - Analyze user responses
- `POST /api/ai/generate-document` - Generate specific documents
- `GET /api/health` - Health check

### Development Setup
```bash
# Start both frontend and backend
./start_dev.sh

# Or manually:
# 1. Backend (Terminal 1)
source venv/bin/activate
python backend_api.py

# 2. Frontend (Terminal 2)  
cd vibeguide-frontend
npm run dev
```

### Testing
- **Test Script**: `test_api.py` - Validates API functionality
- **Health Check**: `curl http://localhost:5000/api/health`

## Key Development Patterns

- **Path Aliases**: Use `@/` for src directory imports (configured in vite.config.ts and tsconfig.json)
- **Type Safety**: Comprehensive TypeScript types in `src/types/store.ts`
- **Immutable State**: Use Immer patterns when updating Zustand store
- **Step Management**: Multi-step workflow with validation between steps
- **Error Boundaries**: Granular error handling per feature area
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Testing

No test framework is currently configured. When adding tests, check the package.json and existing patterns first.

## Important Notes

- The AI service is currently mocked - real API integration requires backend endpoint at `/api/ai/generate`
- Store persistence only saves projects and settings, not sensitive user data
- The application supports 3-step workflow: Project Description → AI Analysis → Document Generation
- All AI-generated content should be treated as draft and reviewed before use