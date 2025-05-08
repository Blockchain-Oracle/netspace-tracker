#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process for netspace-tracker with pnpm...${NC}"

# Check if node and pnpm are installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 16+ and try again.${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}pnpm is not installed. Please install pnpm and try again.${NC}"
    exit 1
fi

# Environment check
NODE_ENV=${NODE_ENV:-production}
echo -e "${YELLOW}Deploying for environment: ${NODE_ENV}${NC}"

# Install dependencies (including dev dependencies needed for build)
echo -e "${GREEN}Installing dependencies...${NC}"
pnpm install

# Handle better-sqlite3 native module
echo -e "${YELLOW}Setting up better-sqlite3 native module...${NC}"
pnpm rebuild better-sqlite3

# Special handling for macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${YELLOW}Detected macOS, using special build process for better-sqlite3...${NC}"
    cd node_modules/better-sqlite3 && \
    npm run build-release && \
    cd ../..
fi

# Create data directory
echo -e "${GREEN}Setting up data directories...${NC}"
mkdir -p ./data
chmod 755 ./data

# Build the application
echo -e "${GREEN}Building the application...${NC}"
pnpm run build

# Create a .env file if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cp .env.example .env.local || cp src/app/.env.example .env.local
    echo -e "${YELLOW}Please update the .env.local file with your configuration${NC}"
fi

# Database migration if needed
echo -e "${GREEN}Initializing database...${NC}"
touch ./data/subscriptions.db
node ./scripts/init-db.js

echo -e "${GREEN}Deployment setup completed successfully!${NC}"
echo -e "${YELLOW}To start the application, run: pnpm start${NC}" 