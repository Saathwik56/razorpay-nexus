# Multi-Stage Production Dockerfile for AgentBoost
FROM node:20-alpine AS builder

# Install OpenSSL & libc for Prisma engine compatibility on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy full application source (excluding node_modules via .dockerignore)
COPY . .

# Generate Prisma Client & Build Vite production bundle
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

# Install OpenSSL & libc runtime dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY . .

EXPOSE 5173
EXPOSE 3001

CMD ["node", "scripts/docker-start.js"]
