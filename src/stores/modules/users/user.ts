import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import UserModel, { SecurityLevel } from './models/UserModel';
import { useApiStore } from '@/stores/modules/api';
import { updateActiveLanguage } from '@/libs/utils/Language';
import { ServerError } from '@/libs/utils/Errors';
import { debounce } from '@/libs/utils/Debounce';
import { storageService } from '@/libs/utils/StorageService';
import { PendingInterceptor } from '@/libs/interceptors/PendingInterceptor';

export const useUsersStore = defineStore('users', () => {
  // State
  const currentUser = ref<UserModel | null>(null);
  const usersMap = ref<Map<number | string, UserModel>>(new Map());
  const usersFetched = ref(false);
  const isLoggingOut = ref(false);
  const authStatusChecked = ref(false);

  // Getters

  const isAuthenticated = computed(() => !!currentUser.value);
  const currentUserId = computed(() => currentUser.value?.id ?? null);
  const level = computed(() => currentUser.value?.level ?? SecurityLevel.EXTERNAL);
  const email = computed(() => currentUser.value?.email ?? null);
  const token = computed(() => storageService.getAuthToken());
  const internal = computed(() => currentUser.value?.internal ?? false);
  const language = computed(() => currentUser.value?.preferences?.language?.toLowerCase?.() ?? 'en');
  const getInitial = computed(() =>
    currentUser.value?.name ? currentUser.value.name.substring(0, 1).toUpperCase() : '-'
  );

  const getAllUsers = computed(() => Array.from(usersMap.value.values()));
  const getUserById = (userId: number | string): UserModel | null => {
    return usersMap.value.get(userId) ?? null;
  };
  const getAdminUsers = computed(() =>
    getAllUsers.value.filter((user) => user.level === SecurityLevel.ADMIN)
  );

  const userColorFromId = (userId: number): string => {
    const user = getUserById(userId);
    const DEFAULT_COLORS = ['#fc842c', '#b43893', '#c98963', '#4e8cd4', '#18bc91', '#cf454a'];
    if (!user || !user.color) {
      const numericId = typeof userId === 'string' ? parseInt(userId, 10) || 0 : userId;
      return DEFAULT_COLORS[numericId % DEFAULT_COLORS.length];
    }
    return user.color;
  };

  // Actions - Helpers Internes
  const apiStore = useApiStore();

  function _updateUserInMap(user: UserModel): void {
    usersMap.value.set(user.id, user);
  }

  function _handleAuthenticationError(error: any, context: string): never {
    console.error(`Authentication error in ${context}:`, error);
    const responseData = error.response?.data;
    const apiErrorMessage = responseData?.message || responseData?.data?.message;
    const apiErrorCode = responseData?.code || responseData?.data?.code;

    if (error.response?.status === 401) {
      throw apiErrorCode || apiErrorMessage || 'BAD_CREDENTIALS';
    } else if ([400, 403, 422].includes(error.response?.status)) {
      throw apiErrorCode || apiErrorMessage || 'AUTH_VALIDATION_ERROR';
    } else {
      throw new ServerError('users', context, error, {
        message: apiErrorMessage,
      });
    }
  }

  function _setCurrentUser(user: UserModel | null): void {
    currentUser.value = user;
    if (user) {
      _updateUserInMap(user);

      if (user.preferences?.language) {
        updateActiveLanguage(user.preferences.language.toLowerCase(), false);
      }
    }
  }

  async function initializeAuth(): Promise<void> {
    if (authStatusChecked.value) return;

    const storedToken = storageService.getAuthToken();
    if (storedToken) {
      try {
        console.log('Initializing auth: Found token, fetching current user...');
        const response = await apiStore.api.get('/api/v1/users/me');
        const user = UserModel.fromAPI(response.data.data);
        _setCurrentUser(user);
        console.log('Initializing auth: User fetched successfully.');
      } catch (error: any) {
        console.error('Initializing auth: Failed to fetch user with stored token.', error);
        if (error.response?.status === 401 || error.message === 'BAD_CREDENTIALS') {
          storageService.removeAuthToken();
          _setCurrentUser(null);
        } else {
          console.error('Initialization failed due to non-auth error:', error);
        }
      }
    } else {
      console.log('Initializing auth: No token found.');
      _setCurrentUser(null);
    }
    authStatusChecked.value = true;
  }

  async function login({ email, password }: { email: string; password: string }): Promise<boolean> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    try {
      const response = await apiStore.api.post('/api/v1/auth/login', {
        data: { email, password },
        skipAuthErrorInterceptor: true,
      });

      const tokenFromResponse = response.data?.token || response.data?.data?.token;
      if (tokenFromResponse) {
        storageService.setAuthToken(tokenFromResponse);
      } else {
        console.warn('Login successful, but no token received in response body.');
      }

      await fetchCurrentUser();
      return true;
    } catch (error) {
      console.error('[store login catch] Error during login process:', error);
      _handleAuthenticationError(error, 'login');
    }
  }

  async function logout(): Promise<void> {
    const apiStore = useApiStore();

    try {
      if (!isLoggingOut.value) {
        isLoggingOut.value = true;
        console.warn('Logging out user...');
        if (token.value) {
          await apiStore.api.post('/api/v1/auth/logout', {
            skipAuthErrorInterceptor: true,
          });
        }
      }
    } catch (error) {
      console.error('logout error', error);
    } finally {
      isLoggingOut.value = false;
      storageService.removeAuthToken();
      PendingInterceptor.clearPendingCache();
      currentUser.value = null;
      usersMap.value.clear();
      usersFetched.value = false;
      authStatusChecked.value = false;
      router.push({ name: 'login', replace: true });
    }
  }

  async function changeExpiredPassword({ email, password, newPassword }) {
    const apiStore = useApiStore();
    try {
      await apiStore.api.post('/api/v1/auth/password/expired', {
        data: {
          email,
          password,
          newPassword,
        },
        skipAuthErrorInterceptor: true,
      });
    } catch (error) {
      _handleAuthenticationError(error, 'Expired password');
    }
  }

  async function resetPassword({ email }: { email: string }): Promise<void> {
    try {
      await apiStore.api.post('/api/v1/auth/password/reset', {
        data: { email },
      });
    } catch (error) {
      _handleAuthenticationError(error, 'resetPassword');
    }
  }

  async function confirmResetPassword({ password, code }: { password: string; code: string }): Promise<void> {
    try {
      await apiStore.api.post(`/api/v1/auth/password/reset/${code}/confirm`, {
        data: { password },
      });
    } catch (error) {
      _handleAuthenticationError(error, 'confirmResetPassword');
    }
  }

  async function passwordConfirm({ code }: { code: string }): Promise<void> {
    try {
      await apiStore.api.post(`/api/v1/auth/password/${code}/confirm`);
    } catch (error) {
      throw new ServerError('users', 'passwordConfirm', error, { code });
    }
  }

  // Met à jour le mot de passe et retourne true si c'était celui de l'utilisateur courant.
  async function updateUserPassword({
    user,
    password,
  }: {
    user: UserModel;
    password: string;
  }): Promise<boolean> {
    const apiStore = useApiStore();
    try {
      if (!user) throw 'No user provided';
      await apiStore.api.put(`/api/v1/users/${user.id}/password`, {
        data: {
          password,
        },
        skipAuthErrorInterceptor: true,
      });
      // Retourne true si l'ID de l'utilisateur modifié correspond à l'ID de l'utilisateur connecté
      return user.id === currentUserId.value;
    } catch (error) {
      // Propager l'erreur pour la gestion dans le composant
      throw new ServerError('users', 'updateUserPassword', error, {
        userId: user.id,
      });
    }
  }

  async function fetchCurrentUser(): Promise<UserModel | null> {
    console.log('[fetchCurrentUser] Start'); // Log start
    try {
      console.log('[fetchCurrentUser] Calling API /users/me');
      const response = await apiStore.api.get('/api/v1/users/me');
      console.log('[fetchCurrentUser] API call successful');
      const user = UserModel.fromAPI(response.data.data);
      _setCurrentUser(user);
      console.log('[fetchCurrentUser] User set, returning user.');
      return user;
    } catch (error) {
      console.error('[fetchCurrentUser catch] Failed to fetch current user:', error);
      storageService.removeAuthToken();
      _setCurrentUser(null);
      console.log('[fetchCurrentUser catch] Throwing ServerError');
      throw new ServerError('users', 'fetchCurrentUser', error);
    }
  }

  async function fetchUser(userId: number | string): Promise<UserModel | null> {
    try {
      const response = await apiStore.api.get(`/api/v1/users/${userId}`);
      const user = UserModel.fromAPI(response.data.data);
      _updateUserInMap(user);
      if (currentUser.value && currentUser.value.id === user.id) {
        _setCurrentUser(user);
      }
      return user;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw new ServerError('users', 'fetchUser', error, { userId });
    }
  }

  async function fetchUsers(): Promise<void> {
    try {
      const response = await apiStore.api.get('/api/v1/users');
      const fetchedUsers = response.data.data.map((u: any) => UserModel.fromAPI(u));
      fetchedUsers.forEach(_updateUserInMap);
      usersFetched.value = true;
    } catch (error) {
      throw new ServerError('users', 'fetchUsers', error);
    }
  }

  const debouncedFetchUsers = debounce(fetchUsers, 300);
  async function ensureUsersFetched(): Promise<void> {
    if (!usersFetched.value) {
      await debouncedFetchUsers();
    }
  }

  async function searchUser(identifier: string | number): Promise<UserModel | null> {
    try {
      if (typeof identifier === 'number' || !isNaN(Number(identifier))) {
        const cachedUser = usersMap.value.get(identifier);
        if (cachedUser) return cachedUser;
      }
      const response = await apiStore.api.get(`/api/v1/users/${identifier}`);
      if (response.data?.data) {
        const user = UserModel.fromAPI(response.data.data);
        _updateUserInMap(user);
        return user;
      }
      return null;
    } catch (error: any) {
      if ([403, 404].includes(error.response?.status)) {
        return null;
      }
      throw new ServerError('users', 'searchUser', error, { identifier });
    }
  }

  async function updateUser(user: UserModel): Promise<UserModel> {
    const dataToSend = user.toAPI ? user.toAPI() : { ...user };

    delete dataToSend.id;
    delete dataToSend.createdAt;
    delete dataToSend.updatedAt;

    try {
      const response = await apiStore.api.put(`/api/v1/users/${user.id}`, {
        data: dataToSend,
      });
      const updatedUser = UserModel.fromAPI(response.data.data);
      _updateUserInMap(updatedUser);

      if (currentUser.value && currentUser.value.id === updatedUser.id) {
        _setCurrentUser(updatedUser);
      }
      return updatedUser;
    } catch (error) {
      throw new ServerError('users', 'updateUser', error, { userId: user.id });
    }
  }

  async function addUser(userData: UserModel): Promise<UserModel> {
    const dataToSend: Partial<UserModel> = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      surname: userData.surname,
      level: userData.level,
      internalLevel: userData.internalLevel,
      internal: userData.internal,
      color: userData.color,
      preferences: userData.preferences,
      permissions: userData.permissions,
      permissionsExpireAt: userData.permissionsExpireAt,
    };

    if (!dataToSend.password) {
      console.warn('Password not provided for new user. API might require it.');
    }

    try {
      const response = await apiStore.api.post('/api/v1/users', {
        data: dataToSend,
      });
      const newUser = UserModel.fromAPI(response.data.data);
      _updateUserInMap(newUser);
      return newUser;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(`Erreur lors de l'ajout : ${error.response.data.message}`);
      }
      throw new ServerError('users', 'addUser', error, {
        email: userData.email,
      });
    }
  }

  async function deleteUser(userId: number | string): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    try {
      await apiStore.api.delete(`/api/v1/users/${userId}`);
      const deleted = usersMap.value.delete(userId);
      if (deleted) {
        console.log(`User ${userId} deleted from local map.`);
      }
      if (currentUser.value && currentUser.value.id === userId) {
        await logout();
      }
    } catch (error) {
      throw new ServerError('users', 'deleteUser', error, { userId });
    }
  }

  async function resetPreferences({ user }) {
    const apiStore = useApiStore();
    try {
      if (!user) throw 'No user provided';
      await apiStore.api.delete(`/api/v1/users/${user.id}/preferences`, {
        data: {},
        skipAuthErrorInterceptor: true,
      });
    } catch (error) {
      throw new ServerError('users', 'resetPreferences', error, {});
    }
  }

  async function setPreference({ key, value }: { key: string; value: any }): Promise<void> {
    if (!currentUser.value) {
      console.warn('Cannot set preference: no user logged in.');
      return;
    }
    const userId = currentUser.value.id;
    try {
      await apiStore.api.put(`/api/v1/users/${userId}/preferences/${key}`, {
        data: { value },
      });
      const updatedUser = currentUser.value.clone();
      updatedUser.setPreference(key, value);
      updatedUser.updatedAt = new Date();
      _setCurrentUser(updatedUser);

      if (key === 'language' && typeof value === 'string') {
        const lang = value.toLowerCase() as 'fr' | 'en';
        updateActiveLanguage(lang, false);
        storageService.setLanguage(lang);
      } else if (key === 'theme' && typeof value === 'string') {
        storageService.setItem('theme', value);
      }
    } catch (error) {
      throw new ServerError('users', 'setPreference', error, {
        userId,
        key,
        value,
      });
    }
  }

  return {
    isAuthenticated,
    currentUser,
    currentUserId,
    level,
    email,
    token,
    internal,
    language,
    getInitial,
    getAllUsers,
    getAdminUsers,
    usersFetched,
    authStatusChecked,
    userColorFromId,
    getUserById,
    initializeAuth,
    login,
    logout,
    resetPassword,
    changeExpiredPassword,
    confirmResetPassword,
    updateUserPassword,
    passwordConfirm,
    fetchCurrentUser,
    fetchUser,
    fetchUsers,
    ensureUsersFetched,
    searchUser,
    updateUser,
    addUser,
    deleteUser,
    resetPreferences,
    setPreference,
    // Exposed for testing purposes
    usersMap,
  };
});
