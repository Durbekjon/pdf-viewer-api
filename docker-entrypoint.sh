#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL is ready!"

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
yarn start:prod 