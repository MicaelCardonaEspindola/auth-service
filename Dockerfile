# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Copiar archivos GraphQL explícitamente (si no están dentro de src)
COPY src/**/*.graphql ./src/

# Compilar TypeScript
RUN npm run build

# Etapa final (producción)
FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar código compilado desde builder
COPY --from=builder /app/dist ./dist

# Copiar archivos GraphQL también al contenedor final
COPY --from=builder /app/src/**/*.graphql ./dist/src/

# Exponer puerto
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000
# Comando de inicio
CMD ["node", "dist/main.js"]
