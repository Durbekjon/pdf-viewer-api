# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install netcat for database connection check
RUN apk add --no-cache netcat-openbsd

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install production dependencies only
RUN yarn install --production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema
COPY prisma ./prisma
COPY docker-entrypoint.sh ./

# Create uploads directory
RUN mkdir -p uploads && chown -R node:node uploads && \
    chmod +x docker-entrypoint.sh

# Switch to non-root user
USER node

# Expose the port the app runs on
EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"] 