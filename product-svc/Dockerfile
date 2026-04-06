FROM node:20-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app -u 1001
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER app
EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1
CMD ["node", "server.js"]
