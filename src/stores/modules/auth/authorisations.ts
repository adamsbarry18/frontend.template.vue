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
  // Typed Getters based on the current user from usersStore
  const level = computed(() => usersStore.currentUser?.level ?? SecurityLevel.EXTERNAL);
  const internalLevel = computed(() => usersStore.currentUser?.internalLevel ?? 0);
  const internal = computed(() => usersStore.currentUser?.internal ?? false);
  const permissionsExpireAtComputed = computed(() =>
    usersStore.currentUser?.permissionsExpireAt ? dayjs(usersStore.currentUser.permissionsExpireAt) : null
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

      const permissions = usersStore.currentUser?.permissions;
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
   * @returns The user's authorisations, level, expiration, and active status, or null if forbidden or not found.
   */
  async function getUserAuthorisations(userId: number): Promise<{
    authorisation: Record<string, string[]>;
    expire: string | null;
    level: number;
    isActive: boolean;
  } | null> {
    try {
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
   * Updates a user's status (active, expiration, level) (admin only).
   * Replaces the old createTemporaryAuthorisationForUser.
   * @param userId The ID of the user.
   * @param payload Object containing optional isActive, expire (ISO string or null), and level.
   * @returns Null if forbidden, otherwise void or throws ServerError.
   */
  async function updateUserStatus(
    userId: number,
    payload: { isActive?: boolean; expire?: string | null; level?: number }
  ): Promise<void | null> {
    if (!userId) throw new Error('User ID must be provided.');
    try {
      await apiStore.api.post(`/api/v1/authorization/users/${userId}/status`, {
        data: payload,
      });
      await usersStore.fetchUser(userId);
    } catch (error) {
      if ((error as any).response?.status === 403) return null;
      throw new ServerError('authorisations', 'updateUserStatus', error, { userId, payload });
    }
  }

  return {
    features,
    levelsAuthorisations,
    currentUser: computed(() => usersStore.currentUser), // Expose as a computed ref to the user from usersStore
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
    fetchAllFeatures,
    fetchLevels,
    getLevel,
    getUserAuthorisations,
    updateUserAuthorization,
    deleteUserAuthorizations,
    updateUserStatus,
  };
});
