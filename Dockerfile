# Build container
FROM node:15-alpine AS build
WORKDIR /app

COPY .env ./
COPY package* ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build
RUN npm prune --production

# Final container
FROM node:15-alpine
WORKDIR /app

COPY --from=build /app/public ./public
COPY --from=build /app/.env ./.env
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package* ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
CMD [ "npm", "run", "start" ]
