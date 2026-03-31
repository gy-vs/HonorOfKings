# =============================================================================
# Honor of Kings Vue App - Multi-stage Dockerfile
# =============================================================================
# Stage 1: Build with Node.js
# Stage 2: Serve with Nginx
# Supports both ARM (Apple Silicon, ARM servers) and x86 architectures
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build Stage
# -----------------------------------------------------------------------------
# Using official Node.js Alpine image which supports multi-platform (linux/amd64, linux/arm64)
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
# Using npm ci for reproducible builds if package-lock.json exists
RUN if [ -f package-lock.json ]; then \
      npm ci --silent; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile --silent; \
    elif [ -f pnpm-lock.yaml ]; then \
      corepack enable pnpm && pnpm install --frozen-lockfile; \
    else \
      npm install --silent; \
    fi

# Copy source code
COPY . .

# Build the application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Stage
# -----------------------------------------------------------------------------
# Using official Nginx Alpine image which supports multi-platform (linux/amd64, linux/arm64)
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
