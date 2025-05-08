import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { useApiStore } from '@/stores/modules/api';
import { useUsersStore } from '@/stores/modules/users/user';
import { SecurityLevel } from '@/stores/modules/users/models/UserModel';
import { computed, ref } from 'vue';
import { ServerError } from '@/libs/utils/Errors';

export const useAuthorisationsStore = defineStore('authorisations', () => {
  const features = ref<Record<string, string[]> | null>(null);
  const levelsAuthorisations = ref<Record<string, any> | null>(null);

  // Access to the current user from the users store
  const usersStore = useUsersStore();
  const localCurrentUser = computed(() => (usersStore.currentUser as any)?.value ?? usersStore.currentUser);

  // Typed Getters based on the current user
  const level = computed(() => localCurrentUser.value?.level ?? SecurityLevel.EXTERNAL);
  const internalLevel = computed(() => localCurrentUser.value?.internalLevel ?? 1); // Default to 1 if no user
  const internal = computed(() => localCurrentUser.value?.internal ?? false);
  const permissionsExpireAtComputed = computed(() =>
    localCurrentUser.value?.permissionsExpireAt ? dayjs(localCurrentUser.value.permissionsExpireAt) : null
  );

  /**
   * Checks if the current user's permissions have expired.
   */
  const hasExpired = computed(() => {
    if (!permissionsExpireAtComputed.value) return false;
    return dayjs().isAfter(permissionsExpireAtComputed.value);
  });

  // Standard roles using SecurityLevel enum
  const isUser = computed(() => level.value >= SecurityLevel.USER);
  const isIntegrator = computed(() => level.value >= SecurityLevel.INTEGRATOR);
  const isAdmin = computed(() => level.value === SecurityLevel.ADMIN);

  // Specific authorisation checks
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
   * Fetches all available features and their actions (admin only).
   * @returns A record of features and actions, or null if forbidden.
   */
  async function fetchAllFeatures(): Promise<Record<string, string[]> | null> {
    try {
      const response = await apiStore.api.get('/api/v1/authorization/features');
      features.value = response.data.data;
      return features.value;
    } catch (error) {
      if ((error as any).response?.status === 403) return null;
      throw new ServerError('authorisations', 'fetchAllFeatures', error, {});
    }
  }

  /**
   * Fetches the map of authorisations per security level (admin only).
   * @returns A record of levels and their authorisations, or null if forbidden.
   */
  async function fetchLevels(): Promise<Record<string, any> | null> {
    try {
      const response = await apiStore.api.get('/api/v1/authorization/levels');
      levelsAuthorisations.value = response.data.data;
      return levelsAuthorisations.value;
    } catch (error) {
      if ((error as any).response?.status === 403) return null;
      throw new ServerError('authorisations', 'fetchLevels', error, {});
    }
  }

  /**
   * Fetches authorisations for a specific security level (admin only).
   * @param level The security level number.
   * @returns The authorisations for the given level, or null if forbidden.
   */
  async function getLevel(level: number): Promise<any | null> {
    try {
      const response = await apiStore.api.get(`/api/v1/authorization/levels/${level}`);
      return response.data.data;
    } catch (error) {
      if ((error as any).response?.status === 403) return null;
      throw new ServerError('authorisations', 'getLevel', error, { level });
    }
  }

  /**
   * Fetches authorisations for a specific user (admin only).
   * @param userId The ID of the user.
   * @returns The user's authorisations, or null if forbidden or not found.
   */
  async function getUserAuthorisations(userId: number): Promise<any | null> {
    try {
      // Add a timestamp to bypass browser/server caching if necessary
      const timestamp = Date.now();
      const response = await apiStore.api.get(`/api/v1/authorization/users/${userId}?_t=${timestamp}`);
      return response.data.data;
    } catch (error: any) {
      if ([403, 404].includes(error.response?.status)) return null;
      throw new ServerError('authorisations', 'getUserAuthorisations', error, { userId });
    }
  }

  /**
   * Updates the authorisation for a specific user (admin only).
   * @param userId The ID of the user.
   * @param payload The authorisation data to update.
   * @returns Null if forbidden, otherwise void or throws ServerError.
   */
  async function updateUserAuthorization(
    userId: number,
    payload: {
      level?: number;
      internal?: boolean;
      permissions?: Record<string, string[]> | null;
    }
  ): Promise<void | null> {
    if (!userId) throw new Error('User ID must be provided.');
    try {
      await apiStore.api.put(`/api/v1/authorization/users/${userId}`, {
        data: payload,
      });
    } catch (error) {
      if ((error as any).response?.status === 403) return null;
      throw new ServerError('authorisations', 'updateUserAuthorization', error, { userId, payload });
    }
  }

  /**
   * Resets (deletes) specific authorisations for a user (admin only).
   * @param userId The ID of the user.
   * @returns Null if forbidden, otherwise void or throws ServerError.
   */
  async function deleteUserAuthorizations(userId: number): Promise<void | null> {
    if (!userId) throw new Error('User ID must be provided.');
    try {
      await apiStore.api.delete(`/api/v1/authorization/users/${userId}`);
    } catch (error) {
      if ((error as any).response?.status === 403) return null;
      throw new ServerError('authorisations', 'deleteUserAuthorizations', error, { userId });
    }
  }

  /**
   * Creates a temporary authorisation for a user (admin only).
   * @param userId The ID of the user.
   * @returns The temporary authorisation data, or null if forbidden.
   */
  async function createTemporaryAuthorisationForUser(userId: number): Promise<any | null> {
    try {
      const response = await apiStore.api.post(`/api/v1/authorization/users/${userId}/temporary`);
      return response.data.data;
    } catch (error) {
      if ((error as any).response?.status === 403) return null;
      throw new ServerError('authorisations', 'createTemporaryAuthorisationForUser', error, { userId });
    }
  }

  return {
    features,
    levelsAuthorisations,
    currentUser: localCurrentUser,
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
    updateUserAuthorization,
    deleteUserAuthorizations,
    createTemporaryAuthorisationForUser,
  };
});
