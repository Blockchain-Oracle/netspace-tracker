#!/bin/bash

echo "Building better-sqlite3..."
cd node_modules/better-sqlite3 && npm run build-release

echo "Better-sqlite3 built successfully!"
echo "You can now run your application with 'pnpm dev' or 'pnpm build'" 