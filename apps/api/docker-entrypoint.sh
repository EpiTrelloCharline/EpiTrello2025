#!/bin/sh
# ===========================================
# Production Entrypoint Script for EpiTrello API
# ===========================================

set -e

echo "🚀 Starting EpiTrello API..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
MAX_RETRIES=30
RETRY_COUNT=0

# Extract host from DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

echo "Database host: $DB_HOST, port: $DB_PORT"

# Wait for postgres to be available
until nc -z $DB_HOST $DB_PORT 2>/dev/null || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  echo "⏳ Waiting for database... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Failed to connect to database after $MAX_RETRIES attempts"
  exit 1
fi

echo "✅ Database connection established"

# Wait a bit more for database to be fully ready
sleep 3

# Run Prisma migrations if prisma CLI is available
if command -v npx >/dev/null 2>&1; then
  echo "📦 Running database migrations..."
  npx prisma migrate deploy --schema=/app/apps/api/prisma/schema.prisma || echo "⚠️ Migrations may have failed or not needed"
fi

# Start the application
echo "🎉 Starting NestJS application..."
exec node dist/main.js
