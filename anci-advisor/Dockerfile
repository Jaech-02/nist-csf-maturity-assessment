# Static export Next.js -> nginx (puerto 80 interno; detras de jwilder/nginx-proxy)
FROM node:20-alpine AS builder
WORKDIR /app

# Dominio publico HTTPS (metadatos OG). CI puede sobreescribir con build-arg.
ARG NEXT_PUBLIC_SITE_URL=https://nistcsf.uptlibre.pe
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
