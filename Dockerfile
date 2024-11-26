FROM node:20-alpine AS base

FROM base AS deps

WORKDIR /app

RUN apk add --no-cache git
RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm install

# 
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 
FROM base as runner

WORKDIR /app

COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "start"]
