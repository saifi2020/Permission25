# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install python and build tools (only needed for build)
RUN apk add --no-cache python3 make g++

# Copy package files first (for better caching)
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --only=production=false

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create runtime config script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo '# Generate runtime config' >> /docker-entrypoint.sh && \
    echo 'cat > /usr/share/nginx/html/config.js << EOF' >> /docker-entrypoint.sh && \
    echo 'window.__RUNTIME_CONFIG__ = {' >> /docker-entrypoint.sh && \
    echo '  VITE_API_URL: "${VITE_API_URL}",' >> /docker-entrypoint.sh && \
    echo '  VITE_CHAIN_ID: "${VITE_CHAIN_ID}",' >> /docker-entrypoint.sh && \
    echo '  VITE_RPC_URL: "${VITE_RPC_URL}",' >> /docker-entrypoint.sh && \
    echo '  VITE_FACTORY_CONTRACT_ADDRESS: "${VITE_FACTORY_CONTRACT_ADDRESS}",' >> /docker-entrypoint.sh && \
    echo '  VITE_VERIFIER_CONTRACT_ADDRESS: "${VITE_VERIFIER_CONTRACT_ADDRESS}",' >> /docker-entrypoint.sh && \
    echo '  VITE_FORTE_API_URL: "${VITE_FORTE_API_URL}",' >> /docker-entrypoint.sh && \
    echo '  VITE_IPFS_GATEWAY: "${VITE_IPFS_GATEWAY}",' >> /docker-entrypoint.sh && \
    echo '  VITE_TEE_ENDPOINT: "${VITE_TEE_ENDPOINT}",' >> /docker-entrypoint.sh && \
    echo '  VITE_ENABLE_TESTNET: "${VITE_ENABLE_TESTNET}",' >> /docker-entrypoint.sh && \
    echo '  VITE_WALLETCONNECT_PROJECT_ID: "${VITE_WALLETCONNECT_PROJECT_ID}"' >> /docker-entrypoint.sh && \
    echo '};' >> /docker-entrypoint.sh && \
    echo 'EOF' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Environment variables (with defaults for development)
ENV VITE_API_URL=http://localhost:3000/api
ENV VITE_CHAIN_ID=56
ENV VITE_RPC_URL=https://bsc-dataseed.binance.org
ENV VITE_FACTORY_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
ENV VITE_VERIFIER_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
ENV VITE_FORTE_API_URL=https://api.forte.io
ENV VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
ENV VITE_TEE_ENDPOINT=http://localhost:8080
ENV VITE_ENABLE_TESTNET=false
ENV VITE_WALLETCONNECT_PROJECT_ID=27ee5e438ac091955299076b4d547aa6

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Use the custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]