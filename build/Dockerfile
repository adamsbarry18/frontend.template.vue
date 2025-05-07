# Étape 1: Builder l'application et Storybook
# Utilisation d'une image Node.js plus récente et sécurisée
FROM node:22-alpine AS builder

# Arguments de build (seront passés par build.sh)
ARG BUILD_ENV
ARG BUILD_ID
ARG APP_NAME
ARG GITHUB_TOKEN

# ENV NODE_ENV will be set after npm ci to ensure devDependencies are installed
ENV GENERATE_SOURCEMAP=false
# STORYBOOK_BASE_PATH est utilisé par Storybook pour générer les chemins corrects si servi dans un sous-dossier.
# Nginx servira Storybook depuis /usr/share/nginx/html/storybook, qui correspondra à l'URL /storybook/
ENV STORYBOOK_BASE_PATH=/storybook/

WORKDIR /app

# Copier les fichiers de dépendances et installer les dépendances
# Le contexte de build Docker sera la racine du projet (défini dans build.sh)
# Donc les chemins ici sont relatifs à la racine du projet.
# Assurez-vous d'avoir un fichier .dockerignore à la racine de votre projet
# pour exclure node_modules, .git, .env, etc. du contexte de build.
COPY package.json package-lock.json ./
COPY .npmrc .npmrc
# Copier le reste des sources de l'application (avant npm install)
COPY . .

# npm utilisera la variable d'environnement GITHUB_TOKEN si elle est passée comme ARG
# et que .npmrc contient ${GITHUB_TOKEN}
RUN npm install --quiet --ignore-scripts
# Now set NODE_ENV for the subsequent build steps
ENV NODE_ENV=${BUILD_ENV}


# Builder l'application en fonction de BUILD_ENV
RUN echo "Building application for environment: ${BUILD_ENV}"
RUN npm --version # DEBUG: Check if npm is accessible before the build script
RUN if [ "$BUILD_ENV" = "production" ]; then \
    npm run build:prod; \
    elif [ "$BUILD_ENV" = "test" ]; then \
    npm run build:test; \
    else \
    npm run build; \
    fi

# Builder Storybook si BUILD_ENV n'est pas "production"
# Sortie dans dist/storybook pour une copie facile vers Nginx
RUN if [ "$BUILD_ENV" != "production" ]; then \
    echo "Building Storybook..."; \
    npm run build-storybook -- -o dist/storybook; \
    else \
    echo "Skipping Storybook build for production environment."; \
    mkdir -p dist/storybook; \
    fi

# Étape 2: Servir l'application avec Nginx
# Utilisation d'une image Nginx plus récente et sécurisée
FROM nginx:stable-alpine AS runner

# Arguments et variables d'environnement pour Nginx (APP_NAME est passé par build.sh)
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Supprimer la configuration Nginx par défaut
RUN rm -f /etc/nginx/conf.d/default.conf

# Copier la configuration Nginx personnalisée
# Le Dockerfile est dans build/, donc le chemin vers default est relatif à build/
# Cependant, le contexte de build est la racine du projet.
# Donc, le chemin pour COPY doit être relatif à la racine du projet.
COPY build/default /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés de l'application (depuis /app/dist du builder)
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Copier les fichiers buildés de Storybook (depuis /app/dist/storybook du builder)
# Le répertoire source /app/dist/storybook existera toujours grâce à la modification dans l'étage builder.
COPY --from=builder /app/dist/storybook/ /usr/share/nginx/html/storybook/

EXPOSE 80

# Commande par défaut pour démarrer Nginx
# Nginx s'exécute au premier plan pour que le conteneur reste actif.
CMD ["nginx", "-g", "daemon off;"]