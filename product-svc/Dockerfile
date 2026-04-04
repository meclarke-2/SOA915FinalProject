FROM node:20-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app -u 1001
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER app
EXPOSE 3002
CMD ["node", "server.js"]
