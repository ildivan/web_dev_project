# Build stage
FROM node:20 AS build-stage
WORKDIR /app

# Copio solo package.json e package-lock.json per sfruttare cache
COPY package*.json ./

# Installo tutte le dipendenze (dev e prod)
RUN npm install

# Copio tutto il resto del codice e config (tailwind.config.js, postcss.config.js, src...)
COPY . ./

# Eseguo la build (vite build)
RUN npm run build

# Production stage
FROM nginx:alpine AS production-stage

# Copio la build prod da node build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copia la configurazione personalizzata di nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Esponi la porta 80
EXPOSE 80

# Avvio nginx
CMD ["nginx", "-g", "daemon off;"]
