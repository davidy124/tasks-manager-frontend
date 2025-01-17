# Task Manager Frontend

A React-based task management application with features like task board, user management, and more.

## Features
- Task Board with drag-and-drop functionality
- Task Management (Create, Read, Update, Delete)
- User Management with role-based access
- Password management
- Task filtering and search
- Markdown support for task descriptions
- Responsive design

## Prerequisites
- Node.js (v18 or later)
- npm (comes with Node.js)
- Docker (for containerization)

## Local Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
The app will be available at http://localhost:3002

### Build for Production
```bash
npm run build
```

## Docker Deployment

### Building the Docker Image
```bash
# Build with default tag
docker build -t davidy/task-manager-frontend:latest .

# Build with version tag
docker build -t davidy/task-manager-frontend:1.0.0 .
docker buildx build --platform linux/arm64 -t davidy/task-manager-frontend:1.0.0-arm --load .
```

### Running the Container

#### Basic Run
```bash
docker run -d \
  --name task-manager-frontend \
  -p 80:80 \
  task-manager-frontend:latest
```

#### With Custom Backend URL (Important: Include http:// prefix)
```bash
docker run -d \
  --name task-manager-frontend \
  -p 80:80 \
  -e API_URL=host.docker.internal:8084 \
  task-manager-frontend:1.0.0
```


host.docker.internal:8443

#### With Docker Network
```bash
# Create network
docker network create task-manager-network

# Run with network (Include http:// prefix)
docker run -d \
  --name task-manager-frontend \
  -p 80:80 \
  -e API_URL=http://task-manager-api:8084 \
  --network task-manager-network \
  task-manager-frontend:latest
```

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| BACKEND_API_URL | URL of the backend API (include http:// prefix) | http://backend-api:8084 |

### Docker Compose Example
```yaml
version: '3.8'
services:
  frontend:
    build: .
    container_name: task-manager-frontend
    ports:
      - "80:80"
    environment:
      - BACKEND_API_URL=http://task-manager-api:8084
    networks:
      - task-manager-network
    restart: unless-stopped

networks:
  task-manager-network:
    name: task-manager-network
```

Save as `docker-compose.yml` and run:
```bash
docker-compose up -d
```

## Project Structure
```
src/
├── api/          # API integration
├── components/   # Reusable components
├── context/      # React context (Auth)
├── pages/        # Page components
└── theme.js      # Material-UI theme
```

## Key Dependencies
- React 18
- Material-UI
- React Query
- React Router
- React Hook Form
- Date-fns
- Axios
- React Markdown

## Development Notes
- Uses React Query for API state management
- Material-UI for component library
- JWT authentication
- Role-based access control
- Nginx for production serving
- API proxy configuration included

## Security Features
- JWT token handling
- Role-based menu access
- Secure password updates
- Protected routes
- CORS configuration

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)