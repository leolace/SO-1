# FROM node:20-alpine AS development-dependencies-env
# RUN npm install -g pnpm
# COPY ./entrega-final /app
# WORKDIR /app
# RUN pnpm install

FROM node:20-alpine AS dependencies-env
RUN npm install -g pnpm
COPY ./entrega-final/package.json ./entrega-final/pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install

FROM node:20-alpine AS build-env
RUN apk add --no-cache gcc g++ make
RUN npm install -g pnpm
COPY ./entrega-final /app/
COPY --from=dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN pnpm build

# Compilação dos arquivos de cada checkpoint
COPY ./checkpoint-1 /checkpoint-1
COPY ./checkpoint-2 /checkpoint-2
COPY ./checkpoint-3 /checkpoint-3

WORKDIR /checkpoint-1
COPY memory-management.c io.c process.c ./
RUN gcc -o mem.out memory-management.c
RUN gcc -o io.out io.c
RUN gcc -o process.out process.c
COPY mem.out io.out process.out /entrega-final/bin/

# WORKDIR /checkpoint-2
# RUN gcc -o main.out main.c

# WORKDIR /checkpoint-3
# RUN gcc -o main.out main.c

FROM node:20-alpine
COPY ./entrega-final/package.json ./entrega-final/pnpm-lock.yaml /app/
COPY --from=build-env /app/bin /app/bin
COPY --from=dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
RUN apk add --no-cache gcc g++ make
RUN npm install -g pnpm
WORKDIR /app
CMD ["pnpm", "start"]