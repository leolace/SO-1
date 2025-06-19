# FROM node:20-alpine AS development-dependencies-env
# RUN npm install -g pnpm
# COPY ./entrega-final /app
# WORKDIR /app
# RUN pnpm install

FROM node:20-alpine AS dependencies-env
RUN npm install -g pnpm
COPY ./package.json ./pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install

FROM node:20-alpine AS build-env
RUN apk add --no-cache gcc g++ make
RUN npm install -g pnpm
COPY . /app/
COPY --from=dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN pnpm prisma:generate
RUN pnpm compile
RUN pnpm build

FROM node:20-alpine
COPY . /app/
COPY --from=dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/checkpoints /app/checkpoints
RUN apk add --no-cache gcc g++ make
RUN npm install -g pnpm
WORKDIR /app
RUN mv .env.prod .env
RUN pnpm prisma:generate
RUN pnpm migrate:deploy
CMD ["pnpm", "start"]