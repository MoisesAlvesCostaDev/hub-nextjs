# Etapa 1: Build da aplicação
FROM node:22.12.0-slim AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY ../package.json ../package-lock.json ./
COPY ../ ./

# Instala as dependências
RUN npm install --legacy-peer-deps

# Constrói a aplicação Next.js
RUN npm run build

# Etapa 2: Configuração para produção
FROM node:22.12.0-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários do build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Instala apenas as dependências de produção
RUN npm install --production --legacy-peer-deps

# Define a variável de ambiente
ENV NODE_ENV production

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
