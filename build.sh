#!/bin/bash


  # Navigate to node_modules and rebuild better-sqlite3
  echo "Rebuilding better-sqlite3..."
  cd node_modules/better-sqlite3
  npm run build-release
  cd ../..
  
  # Run the normal build process
  echo "Running next build..."
  pnpm run build
  