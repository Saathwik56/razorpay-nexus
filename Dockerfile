# Production Dockerfile for Razorpay Nexus
FROM node:20-alpine

# Install OpenSSL & libc for Prisma engine compatibility on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Production environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL="file:./dev.db"

# Copy package manifests & Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy full application source
COPY . .

# Generate Prisma Client & Build Vite bundle
RUN npx prisma generate
RUN npm run build

EXPOSE 5173
EXPOSE 3001

CMD ["node", "scripts/docker-start.js"]
