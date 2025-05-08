# Docker Setup for Netspace Tracker

This project includes Docker configuration for both development and production environments, using pnpm as the package manager.

## Prerequisites

- Docker
- Docker Compose

## Development Environment

The development setup provides hot-reloading and other development features:

```bash
cd netspace-tracker
./create-data-dir.sh
docker-compose -f docker-compose.dev.yml up
```

This will:
- Mount your local code into the container for live updates
- Use the turbopack-powered development server
- Properly build better-sqlite3 to avoid compatibility issues

## Production Environment

For production deployment:

```bash
cd netspace-tracker
./create-data-dir.sh
docker-compose up -d
```

## Better-SQLite3 Configuration

The Docker setup includes explicit handling for better-sqlite3:

1. Installs all necessary build dependencies (python3, make, g++, gcc, libc-dev)
2. Explicitly runs `npm run build-release` in the better-sqlite3 directory
3. Creates proper volume mapping for SQLite database files

This approach solves the common issues with better-sqlite3 on various environments including Vercel.

## Data Persistence

SQLite database files are stored in the `./data` directory, which is mounted as a volume to ensure data persistence between container restarts.

## Troubleshooting

### Container Logs

```bash
# For production
docker-compose logs -f

# For development
docker-compose -f docker-compose.dev.yml logs -f
```

### Rebuilding Containers

If you need to rebuild the containers after changes to Dockerfile or dependencies:

```bash
# For production
docker-compose up -d --build

# For development
docker-compose -f docker-compose.dev.yml up --build
```

### Stopping Containers

```bash
# For production
docker-compose down

# For development
docker-compose -f docker-compose.dev.yml down
```

## Production Deployment Notes

For production deployment, consider:

1. Using environment variables for sensitive information
2. Setting up proper backup for the data volume
3. Implementing healthchecks (already included in docker-compose files)
4. Setting up proper networking and firewall rules 