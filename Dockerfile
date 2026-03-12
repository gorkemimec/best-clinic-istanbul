# ============================================
# Stage 1: Frontend Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Ensure devDependencies (vite, etc.) are installed during build
ENV NODE_ENV=development

# Frontend dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ============================================
# Stage 2: Production (Express + Static Files)
# ============================================
FROM node:20-alpine

WORKDIR /app

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy backend source
COPY server/index.js ./server/
COPY server/.env.example ./server/

# Port
EXPOSE 3000

WORKDIR /app/server
CMD ["node", "index.js"]
