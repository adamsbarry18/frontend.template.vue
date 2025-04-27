import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { useApiStore } from '@/stores/modules/api';
import { useUsersStore } from '@/stores/modules/users/user';
import { computed, ref } from 'vue';
import { ServerError } from '@/libs/utils/Errors';


export const useAuthorisationsStore = defineStore('authorisations', () => {
  const features = ref<any[] | null>(null);
  const levelsAuthorisations = ref<Record<string, any> | null>(null);

  // Accès à l'utilisateur courant
  const usersStore = useUsersStore();
  const currentUser = computed(() => usersStore.currentUser);

  // Getters typés
  const level = computed(() => currentUser.value?.level ?? 0);
  const internalLevel = computed(() => currentUser.value?.internalLevel ?? 0);
  const internal = computed(() => currentUser.value?.internal ?? false);
  const permissionsExpireAt = computed(() => currentUser.value?.permissionsExpireAt ? dayjs(currentUser.value.permissionsExpireAt) : null);
  const hasExpired = computed(() => {
    if (!permissionsExpireAt.value) return false;
    return dayjs().isAfter(permissionsExpireAt.value);
  });
  const authorisationOverrides = computed(() => {
    if (!currentUser.value?.authorisationOverrides) return null;
    try {
      return JSON.parse(currentUser.value.authorisationOverrides);
    } catch {
      return null;
    }
  });

  // Rôles standards
  const isUser = computed(() => level.value >= 3);
  const isIntegrator = computed(() => level.value >= 4);
  const isAdmin = computed(() => level.value >= 5);

  // Vérifie s'il existe un override pour une fonctionnalité/action
  function hasOverride(feature: string, action: string): boolean {
    const overrides = authorisationOverrides.value;
    if (!overrides || !overrides[feature]) return false;
    return Array.isArray(overrides[feature]) ? overrides[feature].includes(action) : false;
  }

  // Logique centrale d'autorisation
  function isAllowed(feature: string, action: string): boolean {
    if (hasExpired.value) return false;
    if (hasOverride(feature, action)) return true;
    if (feature === 'admin') return isAdmin.value;
    if (feature === 'integrator') return isIntegrator.value;
    if (feature === 'user') return isUser.value;
    return false;
  }

  // Actions
  const apiStore = useApiStore();


  /**
   * Récupère toutes les features/actions disponibles (admin)
   */
  async function fetchAllFeatures() {
    try {
      const response = await apiStore.api.get('/authorization/features');
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
      const response = await apiStore.api.get('/authorization/levels');
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
      const response = await apiStore.api.get(`/authorization/levels/${level}`);
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
      const response = await apiStore.api.get(`/authorization/users/${userId}`);
      return response.data.data;
    } catch (error) {
      if ([403, 404].includes(error.response?.status)) return null;
      throw new ServerError('authorisations', 'getUserAuthorisations', error, { userId });
    }
  }

  /**
   * Met à jour le niveau et/ou les overrides d'un utilisateur (admin)
   * @param userId number
   * @param payload { level?: number, authorisationOverrides?: any }
   */
  async function updateUserAuthorization(userId: number, payload: { level?: number, authorisationOverrides?: any }) {
    if (!userId) throw new Error('Aucun userId fourni');
    try {
      await apiStore.api.put(`/authorization/users/${userId}`, { data: payload });
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
      await apiStore.api.delete(`/authorization/users/${userId}`);
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
      const response = await apiStore.api.post(`/authorization/users/${userId}/temporary`);
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 403) return null;
      throw new ServerError('authorisations', 'createTemporaryAuthorisationForUser', error, { userId });
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
    authorisationOverrides,
    isUser,
    isIntegrator,
    isAdmin,
    // Actions
    hasOverride,
    isAllowed,
    fetchAllFeatures,
    fetchLevels,
    getLevel,
    getUserAuthorisations,
    createTemporaryAuthorisationForUser,
    updateUserAuthorization,
    deleteUserAuthorizations,
  };
});
