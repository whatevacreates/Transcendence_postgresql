# -------- build stage --------
FROM node:20 AS build
WORKDIR /app

# Install prod deps (will compile better-sqlite3)
COPY package*.json ./
RUN npm ci --omit=dev

# Build tools only in builder
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy sources and (re)build native module
COPY . .
RUN npm rebuild better-sqlite3 --build-from-source

# -------- runtime stage --------
FROM node:20-slim
ENV NODE_ENV=production
WORKDIR /app

# Copy only what we need
COPY --from=build /app/node_modules ./node_modules
COPY . .

# Cloud Run provides PORT; expose 8080 for local sanity
ENV PORT=8080
EXPOSE 8080

# If your app reads SERVER_PORT, map it at deploy time:
CMD ["node", "src/server.js"]
