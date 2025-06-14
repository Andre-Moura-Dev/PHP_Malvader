# Etapa 1: build
FROM node:22-alpine as build

WORKDIR /app

# Copia os arquivos de dependência do frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copia todos os arquivos do frontend
COPY frontend/ ./
RUN npm run build

# Etapa 2: produção
FROM node:22-alpine

WORKDIR /app

# Copia apenas os arquivos gerados
COPY --from=build /app ./

EXPOSE 3000
CMD ["npm", "start"]
