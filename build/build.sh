#!/bin/sh
set -e # Quitter immédiatement si une commande échoue

# Variables (peuvent être passées en arguments ou définies ici)
IMAGE_NAME="frontend-template-vue" # Nom de votre image
IMAGE_TAG="latest" # Tag de votre image
BUILD_ENV=${1:-development} # Premier argument du script, sinon 'development'
BUILD_ID=${2:-dev} # Deuxième argument du script, sinon 'dev'

echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}..."
echo "Build environment (BUILD_ENV): ${BUILD_ENV}"
echo "Build ID (BUILD_ID): ${BUILD_ID}"

# Se placer dans le répertoire parent du script (racine du projet)
# pour que le contexte Docker (le '.') soit correct et que Dockerfile soit trouvé via build/Dockerfile
cd "$(dirname "$0")/.."

# Vérifier si GITHUB_TOKEN est défini dans l'environnement
if [ -z "${GITHUB_TOKEN}" ]; then
  echo "Warning: GITHUB_TOKEN environment variable is not set."
  echo "Build may fail if private GitHub packages are required."
  # Vous pourriez choisir de quitter ici si le token est absolument nécessaire:
  # echo "Error: GITHUB_TOKEN is required." >&2; exit 1
fi

# Commande de build Docker
# -f build/Dockerfile : Spécifie l'emplacement du Dockerfile
# . : Spécifie le contexte de build (le répertoire courant, c'est-à-dire la racine du projet)
docker build \
  --build-arg BUILD_ENV="${BUILD_ENV}" \
  --build-arg BUILD_ID="${BUILD_ID}" \
  --build-arg APP_NAME="${IMAGE_NAME}" \
  --build-arg GITHUB_TOKEN \
  -t "${IMAGE_NAME}:${IMAGE_TAG}" \
  -f build/Dockerfile .

echo "Docker image ${IMAGE_NAME}:${IMAGE_TAG} built successfully."
echo "To run the container (example): docker run -d -p 8080:80 ${IMAGE_NAME}:${IMAGE_TAG}"