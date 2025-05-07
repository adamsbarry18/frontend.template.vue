import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { useApiStore } from '@/stores/modules/api';
import { useUsersStore } from '@/stores/modules/users/user';
import { SecurityLevel } from '@/stores/modules/users/models/UserModel';
import { computed, ref } from 'vue';
import { ServerError } from '@/libs/utils/Errors';

export const useAuthorisationsStore = defineStore('authorisations', () => {
  const features = ref<Record<string, string[]> | null>(null); // Correction du type ici
  const levelsAuthorisations = ref<Record<string, any> | null>(null);

  // Accès à l'utilisateur courant
  const usersStore = useUsersStore();
  // Dans les tests, usersStore.currentUser EST un Ref.
  // Dans le code de l'application, Pinia gère la réactivité, et usersStore.currentUser est le UserModel ou null.
  // Pour que les getters réagissent au mock (qui utilise un Ref), nous devons accéder à .value.
  // Pour satisfaire TypeScript ici (qui ne voit pas le mock), nous utilisons `as any`.
  const localCurrentUser = computed(() => (usersStore.currentUser as any)?.value ?? usersStore.currentUser);

  // Getters typés
  const level = computed(() => localCurrentUser.value?.level ?? SecurityLevel.EXTERNAL);
  const internalLevel = computed(() => localCurrentUser.value?.internalLevel ?? 1);
  const internal = computed(() => localCurrentUser.value?.internal ?? false);
  const permissionsExpireAtComputed = computed(() =>
    localCurrentUser.value?.permissionsExpireAt ? dayjs(localCurrentUser.value.permissionsExpireAt) : null
  );
  const hasExpired = computed(() => {
    if (!permissionsExpireAtComputed.value) return false;
    return dayjs().isAfter(permissionsExpireAtComputed.value);
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

      const permissions = localCurrentUser.value?.permissions;
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
      const response = await apiStore.api.get(`/api/v1/authorization/levels/${level}`);
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
      // Ajouter un timestamp pour forcer le non-usage du cache navigateur/serveur
      const timestamp = Date.now();
      const response = await apiStore.api.get(`/api/v1/authorization/users/${userId}?_t=${timestamp}`);
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
    payload: {
      level?: number;
      internal?: boolean;
      permissions?: Record<string, string[]> | null;
    } // Ajout de internal? ici
  ) {
    if (!userId) throw new Error('Aucun userId fourni');
    try {
      await apiStore.api.put(`/api/v1/authorization/users/${userId}`, {
        data: payload,
      });
    } catch (error) {
      if (error.response?.status === 403) return null;
      throw new ServerError('authorisations', 'updateUserAuthorization', error, { userId, payload });
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
      throw new ServerError('authorisations', 'deleteUserAuthorizations', error, { userId });
    }
  }

  /**
   * Crée une authorisation temporaire pour un utilisateur (admin)
   */
  async function createTemporaryAuthorisationForUser(userId: number) {
    try {
      const response = await apiStore.api.post(`/api/v1/authorization/users/${userId}/temporary`);
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 403) return null;
      throw new ServerError('authorisations', 'createTemporaryAuthorisationForUser', error, { userId });
    }
  }

  return {
    features,
    levelsAuthorisations,
    currentUser: localCurrentUser, // Expose le computed local pour la cohérence
    level,
    internalLevel,
    internal,
    permissionsExpireAt: permissionsExpireAtComputed,
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
