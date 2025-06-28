# Étape 1: Builder l'application et Storybook
FROM node:22-alpine AS builder

# Arguments de build
ARG BUILD_ENV=development
ARG BUILD_ID=local
ARG APP_NAME=vue-frontend-template
ARG GITHUB_TOKEN

# Variables d'environnement
ENV NODE_ENV=${BUILD_ENV}
ENV GENERATE_SOURCEMAP=false
# STORYBOOK_BASE_PATH pour générer les chemins corrects
ENV STORYBOOK_BASE_PATH=/storybook/

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Copier .npmrc s'il existe
COPY .npmrc* ./

# Installer les dépendances
RUN npm ci --quiet

# Copier le reste des sources
COPY . .

# Builder l'application et Storybook ensemble
RUN if [ "$BUILD_ENV" = "production" ]; then \
    npm run build:full; \
    elif [ "$BUILD_ENV" = "test" ]; then \
    npm run build:full; \
    else \
    npm run build:full; \
    fi

# Vérifier que le build a créé les fichiers
RUN ls -la dist/ && echo "Build completed successfully"

# Étape 2: Servir l'application avec Nginx
FROM nginx:stable-alpine AS runner

# Arguments
ARG APP_NAME=vue-frontend-template
ENV APP_NAME=${APP_NAME}

# Supprimer la configuration Nginx par défaut
RUN rm -f /etc/nginx/conf.d/default.conf

# Copier la configuration Nginx personnalisée
COPY build/default /etc/nginx/conf.d/default.conf

# Copier tous les fichiers buildés (application + Storybook)
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Vérifier que les fichiers sont bien copiés
RUN ls -la /usr/share/nginx/html/ && echo "Files copied successfully"

EXPOSE 80

# Commande par défaut pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]