import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { useApiStore } from '@/stores/modules/api';
import { useUsersStore } from '@/stores/modules/users/user';
import { SecurityLevel } from '@/stores/modules/users/models/UserModel';
import { computed, ref } from 'vue';
import { ServerError } from '@/libs/utils/Errors';

export const useAuthorisationsStore = defineStore('authorisations', () => {
  const features = ref<any[] | null>(null);
  const levelsAuthorisations = ref<Record<string, any> | null>(null);

  // Accès à l'utilisateur courant
  const usersStore = useUsersStore();
  const currentUser = computed(() => usersStore.currentUser);

  // Getters typés
  const level = computed(() => currentUser.value?.level ?? 1);
  const internalLevel = computed(() => currentUser.value?.internalLevel ?? 1);
  const internal = computed(() => currentUser.value?.internal ?? false);
  const permissionsExpireAt = computed(() =>
    currentUser.value?.permissionsExpireAt
      ? dayjs(currentUser.value.permissionsExpireAt)
      : null
  );
  const hasExpired = computed(() => {
    if (!permissionsExpireAt.value) return false;
    return dayjs().isAfter(permissionsExpireAt.value);
  });

  // Rôles standards using SecurityLevel enum
  const isUser = computed(() => level.value >= SecurityLevel.USER);
  const isIntegrator = computed(() => level.value >= SecurityLevel.INTEGRATOR);
  const isAdmin = computed(() => level.value >= SecurityLevel.ADMIN);

  // Vérification des autorisations spécifiques
  const hasCurrentUserAuthorisation = computed(() => {
    return (feature: string, action: string): boolean => {
      if (isAdmin.value) {
        return true;
      }

      const permissions = currentUser.value?.permissions;
      if (!permissions) {
        return false;
      }

      const featurePermissions = permissions[feature];
      if (!featurePermissions) {
        return false;
      }
      return featurePermissions.includes(action);
    };
  });

  const isUserAllowed = computed(() => hasCurrentUserAuthorisation.value);

  // Actions
  const apiStore = useApiStore();

  /**
   * Récupère toutes les features/actions disponibles (admin)
   */
  async function fetchAllFeatures() {
    try {
      const response = await apiStore.api.get('/api/v1/authorization/features');
      features.value = response.data.data;
      return features.value;
    } catch (error) {
      if (error.response?.status === 403) return null;
      throw new ServerError('authorisations', 'fetchAllFeatures', error, {});
    }
  }

  /**
   * Récupère la map des authorisations par niveau (admin)
   */
  async function fetchLevels() {
    try {
      const response = await apiStore.api.get('/api/v1/authorization/levels');
      levelsAuthorisations.value = response.data.data;
      return levelsAuthorisations.value;
    } catch (error) {
      if (error.response?.status === 403) return null;
      throw new ServerError('authorisations', 'fetchLevels', error, {});
    }
  }

  /**
   * Récupère les authorisations pour un niveau donné (admin)
   */
  async function getLevel(level: number) {
    try {
      const response = await apiStore.api.get(
        `/api/v1/authorization/levels/${level}`
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 403) return null;
      throw new ServerError('authorisations', 'getLevel', error, { level });
    }
  }

  /**
   * Récupère les authorisations d'un utilisateur (admin)
   */
  async function getUserAuthorisations(userId: number) {
    try {
      const response = await apiStore.api.get(
        `/api/v1/authorization/users/${userId}`
      );
      return response.data.data;
    } catch (error) {
      if ([403, 404].includes(error.response?.status)) return null;
      throw new ServerError('authorisations', 'getUserAuthorisations', error, {
        userId,
      });
    }
  }

  async function updateUserAuthorization(
    userId: number,
    payload: { level?: number; permissions?: Record<string, string[]> | null }
  ) {
    if (!userId) throw new Error('Aucun userId fourni');
    try {
      await apiStore.api.put(`/api/v1/authorization/users/${userId}`, {
        data: payload,
      });
    } catch (error) {
      if (error.response?.status === 403) return null;
      throw new ServerError(
        'authorisations',
        'updateUserAuthorization',
        error,
        { userId, payload }
      );
    }
  }

  /**
   * Réinitialise les authorisations spécifiques d'un utilisateur (admin)
   * @param userId number
   */
  async function deleteUserAuthorizations(userId: number) {
    if (!userId) throw new Error('Aucun userId fourni');
    try {
      await apiStore.api.delete(`/api/v1/authorization/users/${userId}`);
    } catch (error) {
      if (error.response?.status === 403) return null;
      throw new ServerError(
        'authorisations',
        'deleteUserAuthorizations',
        error,
        { userId }
      );
    }
  }

  /**
   * Crée une authorisation temporaire pour un utilisateur (admin)
   */
  async function createTemporaryAuthorisationForUser(userId: number) {
    try {
      const response = await apiStore.api.post(
        `/api/v1/authorization/users/${userId}/temporary`
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 403) return null;
      throw new ServerError(
        'authorisations',
        'createTemporaryAuthorisationForUser',
        error,
        { userId }
      );
    }
  }

  return {
    features,
    levelsAuthorisations,
    currentUser,
    level,
    internalLevel,
    internal,
    permissionsExpireAt,
    hasExpired,
    isUser,
    isIntegrator,
    isAdmin,
    hasCurrentUserAuthorisation,
    isUserAllowed,
    // Actions
    fetchAllFeatures,
    fetchLevels,
    getLevel,
    getUserAuthorisations,
    createTemporaryAuthorisationForUser,
    updateUserAuthorization,
    deleteUserAuthorizations,
  };
});
