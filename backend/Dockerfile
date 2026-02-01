FROM node:20-alpine

WORKDIR /app

# dependências
COPY package*.json ./
RUN npm ci

# código
COPY . .

# GENERATE PRISMA
RUN npx prisma generate
# build typescript
RUN npm run build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/server.js"]
