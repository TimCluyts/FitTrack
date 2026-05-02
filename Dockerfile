FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
RUN apk upgrade --no-cache
WORKDIR /app
COPY --from=builder /app/.build ./.build
COPY server.mjs .
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.mjs"]
