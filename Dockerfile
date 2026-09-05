# Dockerfile - works for both Render and local Docker
FROM node:20-alpine

# Required for Prisma on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm install --include=dev

# Copy prisma schema
COPY prisma ./prisma/

# Set DATABASE_URL BEFORE prisma generate (required by Prisma even for code generation)
ENV DATABASE_URL="file:/tmp/dev.db"
ENV NODE_ENV=production
ENV PORT=3001

# Generate Prisma client
RUN npx prisma generate

# Copy rest of source code
COPY . .

EXPOSE 3001

# Start the server via render-start.js (handles db push + seed + server)
CMD ["node", "scripts/render-start.js"]
