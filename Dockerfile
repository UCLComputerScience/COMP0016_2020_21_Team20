# Build container
FROM node:15-alpine AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# Final container
FROM node:15-alpine
WORKDIR /app

COPY --from=build /app/package* ./
COPY --from=build /app/.next ./.next

RUN npm install --production
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
CMD [ "npm", "run", "start" ]
