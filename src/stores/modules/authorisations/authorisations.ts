import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import AuthorisationModel, {
  IAuthorisation,
} from './models/AuthorisationModel';
import { useApiStore } from '@/stores/modules/api';
import { useUsersStore } from '@/stores/modules/users/user';
import { computed, ref } from 'vue';

export const useAuthorisationsStore = defineStore('authorisations', () => {
  // State
  const authorisationsData = ref<IAuthorisation | null>(null);

  // Getters
  const getCurrentAuthorisation = () => {
    const usersStore = useUsersStore();
    const currentUserId = usersStore.currentUser?.id;
    if (
      !currentUserId ||
      authorisationsData.value?.fkUserId !== currentUserId
    ) {
      return null;
    }
    return authorisationsData.value;
  };

  const currentUserAuthorisations = computed(() => {
    return getCurrentAuthorisation();
  });

  const levelForCurrentUser = computed(() => {
    return currentUserAuthorisations.value?.level || 0;
  });

  const isUser = computed(() => levelForCurrentUser.value >= 2);
  const isIntegrator = computed(() => levelForCurrentUser.value >= 4);
  const isAdmin = computed(() => levelForCurrentUser.value >= 5);

  const hasCurrentUserAuthorisation = computed(
    () => (feature: string, action: string) => {
      const authorisation = currentUserAuthorisations.value;
      if (!authorisation?.authorisations?.hasOwnProperty(feature)) {
        return false;
      }
      return authorisation.authorisations[feature].includes(action);
    }
  );

  const isUserAllowed = computed(() => (feature: string, action: string) => {
    return hasCurrentUserAuthorisation.value(feature, action);
  });

  // Actions
  async function ensureAuthorisations() {
    const usersStore = useUsersStore();
    const { currentUser } = usersStore;
    if (!currentUser) {
      throw new Error('Unable to fetch authorisations');
    }
    if (!currentUserAuthorisations.value) {
      await fetchAuthorisations({ userId: currentUser.id });
    }
  }

  async function fetchAuthorisations({ userId }) {
    const apiStore = useApiStore();
    try {
      if (!userId) {
        throw new Error('Unable to fetch authorisations');
      }
      const response = await apiStore.api.get(`api/v1/authorisations`, {
        params: { userId },
      });
      const { authorisations, level, expire } = response.data.data;
      authorisationsData.value = new AuthorisationModel({
        fkUserId: userId,
        level,
        authorisations,
        expire: expire ? dayjs(expire).toDate() : null,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async function updateLevel({
    userId,
    level,
  }: {
    userId: string;
    level: number;
  }) {
    const apiStore = useApiStore();
    try {
      await apiStore.api.put(`api/v1/users/${userId}`, {
        data: {
          level,
        },
      });
      // Update local state
      if (authorisationsData.value?.fkUserId === userId) {
        authorisationsData.value.level = level;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function deleteAuthorisation({ userId }: { userId: string }) {
    const apiStore = useApiStore();
    try {
      await apiStore.api.delete(`api/v1/users/${userId}`);
      // Clear local state if it matches
      if (authorisationsData.value?.fkUserId === userId) {
        authorisationsData.value = null;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function createTemporaryAuthorisation() {
    const apiStore = useApiStore();
    try {
      await apiStore.api.post(`api/v1/authorisations/temporary`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // Return the state, getters, and actions
  return {
    authorisationsData,
    currentUserAuthorisations,
    levelForCurrentUser,
    isUser,
    isIntegrator,
    isAdmin,
    hasCurrentUserAuthorisation,
    isUserAllowed,
    getCurrentAuthorisation,
    ensureAuthorisations,
    fetchAuthorisations,
    updateLevel,
    deleteAuthorisation,
    createTemporaryAuthorisation,
  };
});
