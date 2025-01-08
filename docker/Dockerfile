FROM node:22.12.0-slim AS builder

WORKDIR /app

COPY ../package.json ../package-lock.json ./
COPY ../ ./

RUN npm install --legacy-peer-deps

RUN npm run build

FROM node:22.12.0-slim

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm install --production --legacy-peer-deps

ENV NODE_ENV production
ENV PORT 3001  

EXPOSE 3001

CMD ["npm", "start"]
