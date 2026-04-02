# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

#Copy the analytics json file inside dist config folder
RUN mkdir -p dist/config && cp src/config/*.json dist/config/

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory for multer (hero, categories, products, etc.)
RUN mkdir -p uploads/hero uploads/categories uploads/products uploads/certificates \
    uploads/about uploads/showcase

ENV NODE_ENV=production
ENV PORT=5020
EXPOSE 5020

CMD ["node", "dist/server.js"]
