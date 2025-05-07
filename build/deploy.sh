#!/bin/sh
set -e # Quitter immédiatement si une commande échoue

# Variables (peuvent être passées en arguments ou définies ici)
IMAGE_NAME="frontend-template-vue" # Doit correspondre au nom utilisé dans build.sh
IMAGE_TAG="latest" # Doit correspondre au tag utilisé dans build.sh
REMOTE_REGISTRY_URL="your-docker-registry.com" # EXEMPLE: docker.io/yourusername, gcr.io/your-project-id, etc.

# L'image locale complète
LOCAL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
# L'image distante complète
REMOTE_IMAGE="${REMOTE_REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "Deploying Docker image ${LOCAL_IMAGE} to ${REMOTE_IMAGE}..."

# Authentification auprès du registre Docker (décommentez et adaptez si nécessaire)
# echo "Logging in to Docker registry..."
# docker login ${REMOTE_REGISTRY_URL} -u YOUR_USERNAME -p YOUR_PASSWORD_OR_TOKEN
# Pour AWS ECR, vous utiliseriez quelque chose comme:
# aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-aws-account-id.dkr.ecr.your-region.amazonaws.com

# Taguer l'image pour le registre distant
echo "Tagging image ${LOCAL_IMAGE} as ${REMOTE_IMAGE}..."
docker tag "${LOCAL_IMAGE}" "${REMOTE_IMAGE}"

# Pousser l'image vers le registre distant
echo "Pushing image ${REMOTE_IMAGE}..."
docker push "${REMOTE_IMAGE}"

echo "Docker image ${REMOTE_IMAGE} deployed successfully."