#!/bin/sh
set -e # Quitter immédiatement si une commande échoue

# Variables
IMAGE_NAME="frontend-template-vue" # Doit correspondre au nom utilisé dans build.sh
IMAGE_TAG="latest" # Doit correspondre au tag utilisé dans build.sh
CONTAINER_NAME="frontend-app" # Nom à donner au conteneur en cours d'exécution
HOST_PORT=8080 # Port sur la machine hôte à mapper vers le port du conteneur
CONTAINER_PORT=80 # Port exposé par le conteneur (Nginx écoute sur 80 par défaut)

echo "Starting Docker container ${CONTAINER_NAME} from image ${IMAGE_NAME}:${IMAGE_TAG}..."

# Vérifier si un conteneur avec le même nom existe déjà et le supprimer
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    echo "Stopping and removing existing container named ${CONTAINER_NAME}..."
    docker stop "${CONTAINER_NAME}"
    docker rm "${CONTAINER_NAME}"
fi

# Lancer le conteneur Docker
# -d : Exécuter en mode détaché (en arrière-plan)
# -p ${HOST_PORT}:${CONTAINER_PORT} : Mapper le port de l'hôte au port du conteneur
# --name ${CONTAINER_NAME} : Donner un nom au conteneur
docker run -d \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  --name "${CONTAINER_NAME}" \
  "${IMAGE_NAME}:${IMAGE_TAG}"

echo "Container ${CONTAINER_NAME} started successfully."
echo "Application should be accessible at http://localhost:${HOST_PORT}"
echo "Storybook (if not in production build) should be at http://localhost:${HOST_PORT}/storybook/"
echo "To view logs: docker logs ${CONTAINER_NAME}"
echo "To stop the container: docker stop ${CONTAINER_NAME}"