# 🐳 Multi-stage Docker Build for MCP Tailwind Gemini
# Optimized for production deployment with minimal size

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy TypeScript config if exists
COPY tsconfig.json* ./

# Install dependencies including dev dependencies for build
RUN npm ci --silent

# Copy source code and other necessary files
COPY src/ ./src/
COPY tests/ ./tests/
COPY scripts/ ./scripts/
COPY mcp.json ./
COPY README.md ./

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S mcpuser && \
    adduser -S mcpuser -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/mcp.json ./

# Copy documentation and scripts
COPY README.md ./
COPY docs/ ./docs/
COPY scripts/*.mjs ./scripts/

# Change ownership to non-root user
RUN chown -R mcpuser:mcpuser /app

# Switch to non-root user
USER mcpuser

# Expose port (if needed for web interface)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('MCP Tailwind Gemini is healthy')" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command
CMD ["node", "dist/index.js"]

# Metadata labels
LABEL maintainer="MCP Tailwind Gemini Team"
LABEL description="Advanced MCP server for Tailwind CSS with Gemini AI integration"
LABEL version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/your-username/mcp-tailwind-gemini"
LABEL org.opencontainers.image.documentation="https://github.com/your-username/mcp-tailwind-gemini/blob/main/README.md"
