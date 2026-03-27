# Internal Developer Platform

A comprehensive platform for managing application templates, deployments, and self-service capabilities for development teams.

## Features

- **Application Templates**: Pre-configured templates for common application types
- **Self-Service Deployments**: Developers can request and deploy applications
- **Deployment Management**: Track and manage application deployments
- **Admin Dashboard**: Approve requests and manage platform resources

## Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy

### Frontend
- React + TypeScript
- Tailwind CSS
- Vite

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Quick Start with Docker

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Run `./scripts/bootstrap.sh` to initialize the database
4. Start services: `docker-compose up`

### Local Development

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Architecture

See `platform-assets/docs/architecture/` for detailed architecture documentation.

## License

MIT