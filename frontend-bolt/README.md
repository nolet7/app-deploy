# app-deploy

A polished enterprise Internal Developer Platform (IDP) frontend for managing application deployments.

## Features

- **Dashboard**: Platform health overview with stats and recent activity
- **New App Request**: Form to create application deployment requests
- **Applications**: Table view of all app requests with actions
- **Templates**: Browse and select from available application templates
- **Deployments**: Track deployment history and status
- **Admin**: Platform administration and configuration

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Alert.tsx
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── EmptyState.tsx
│   ├── Input.tsx
│   ├── LoadingSpinner.tsx
│   ├── Modal.tsx
│   ├── PromptViewer.tsx
│   └── Table.tsx
├── hooks/           # Custom React hooks
│   └── useRouter.ts
├── layouts/         # Layout components
│   ├── Header.tsx
│   ├── MainLayout.tsx
│   └── Sidebar.tsx
├── pages/           # Page components
│   ├── Admin.tsx
│   ├── Applications.tsx
│   ├── Dashboard.tsx
│   ├── Deployments.tsx
│   ├── NewAppRequest.tsx
│   └── Templates.tsx
├── services/        # API client
│   └── api.ts
├── types/           # TypeScript types
│   └── index.ts
└── App.tsx          # Main app component
```

## Backend API

The frontend connects to an existing backend API with the following endpoints:

- `GET /api/healthz` - Health check
- `GET /api/templates` - List templates
- `GET /app-requests` - List app requests
- `POST /app-requests` - Create app request
- `GET /api/deployments` - List deployments
- `POST /api/deployments` - Create deployment
- `GET /api/app-requests/:id/prompt` - Get generated prompt

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `VITE_API_BASE_URL` to your backend API URL.

4. Start development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: empty string)

## Features

### Dashboard
- Platform health status
- Total templates, app requests, and deployments
- Recent activity feed
- Quick action cards

### New App Request
- Form with validation
- Template selection
- Environment configuration
- Database and cache options
- Success state with request details

### Applications
- Searchable table of all app requests
- View details modal
- Generate prompt action
- Deploy action
- Status badges

### Templates
- Card-based template browser
- Template details display
- Resource requirements
- Quick use template action

### Deployments
- Deployment history table
- Status tracking
- Environment breakdown
- Deployment statistics

### Admin
- Platform assets management
- Standards and policies
- Observability configuration
- Integration management
- Approval workflows

## UI Components

The application includes a comprehensive set of reusable components:

- **Card**: Content container with optional header
- **StatCard**: Statistics display card
- **Button**: Primary, secondary, danger, ghost variants
- **Input/Textarea/Select**: Form inputs with validation
- **Table**: Data table with loading and empty states
- **Badge**: Status and label badges
- **Modal/Drawer**: Dialog overlays
- **Alert**: Success, error, warning, info notifications
- **EmptyState**: Placeholder for empty data
- **LoadingSpinner**: Loading indicators

## Navigation

The app uses hash-based routing with the following routes:

- `/` - Dashboard
- `/new-request` - New App Request
- `/applications` - Applications
- `/templates` - Templates
- `/deployments` - Deployments
- `/admin` - Admin

## Production Ready

This frontend is production-ready with:

- Clean, modular code structure
- TypeScript for type safety
- Comprehensive error handling
- Loading and empty states
- Responsive design
- Professional enterprise UI
- Reusable component library
