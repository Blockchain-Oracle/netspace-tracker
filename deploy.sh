#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process for netspace-tracker...${NC}"

# Check if node and npm are installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 16+ and try again.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm and try again.${NC}"
    exit 1
fi

# Environment check
NODE_ENV=${NODE_ENV:-production}
echo -e "${YELLOW}Deploying for environment: ${NODE_ENV}${NC}"

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install --omit=dev

# Handle better-sqlite3 native module
echo -e "${YELLOW}Setting up better-sqlite3 native module...${NC}"
npm_config_build_from_source=true npm rebuild better-sqlite3

# Optional: Additional platforms
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${YELLOW}Detected macOS, using special build process for better-sqlite3...${NC}"
    cd node_modules/better-sqlite3 && \
    npm run build-release && \
    cd ../..
fi

# Create SQLite database directory if it doesn't exist
mkdir -p ./data

# Build the application
echo -e "${GREEN}Building the application...${NC}"
npm run build

# Create data directories with proper permissions
echo -e "${GREEN}Setting up data directories...${NC}"
mkdir -p ./data
chmod 755 ./data

# Create a .env file if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cp .env.example .env.local
    echo -e "${YELLOW}Please update the .env.local file with your configuration${NC}"
fi

# Database migration if needed
echo -e "${GREEN}Initializing database...${NC}"
touch ./data/subscriptions.db
node ./scripts/init-db.js

echo -e "${GREEN}Deployment setup completed successfully!${NC}"
echo -e "${YELLOW}To start the application, run: npm run start${NC}" 