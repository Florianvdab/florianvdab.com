# syntax=docker/dockerfile:1

# ---- Build: static site into /app/dist ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- Runtime: non-root nginx on :8080 ----
FROM nginxinc/nginx-unprivileged:alpine-slim
ARG REVISION=unknown
LABEL org.opencontainers.image.title="florianvdab.com" \
      org.opencontainers.image.description="Portfolio site of Florian Vandenabeele (static Astro build served by nginx)" \
      org.opencontainers.image.source="https://github.com/Florianvdab/florianvdab.com" \
      org.opencontainers.image.url="https://florianvdab.com" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.revision="${REVISION}"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:8080/ || exit 1
