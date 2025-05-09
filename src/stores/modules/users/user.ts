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
  // --- State ---
  const currentUser = ref<UserModel | null>(null);
  const usersMap = ref<Map<number | string, UserModel>>(new Map()); // Stores fetched users by ID
  const usersFetched = ref(false); // Flag to indicate if the initial list of users has been fetched
  const isLoggingOut = ref(false); // Flag to prevent concurrent logout attempts
  const authStatusChecked = ref(false); // Flag to indicate if initial authentication status has been checked

  // --- Getters ---
  const isAuthenticated = computed(() => !!currentUser.value);
  const currentUserId = computed(() => currentUser.value?.id ?? null);
  const level = computed(() => currentUser.value?.level ?? SecurityLevel.EXTERNAL);
  const email = computed(() => currentUser.value?.email ?? null);
  const token = computed(() => storageService.getAuthToken());
  const internal = computed(() => currentUser.value?.internal ?? false);
  const language = computed(() => currentUser.value?.preferences?.language?.toLowerCase?.() ?? 'en');
  const getInitial = computed(() =>
    currentUser.value?.firstName ? currentUser.value.firstName.substring(0, 1).toUpperCase() : '-'
  );

  const getAllUsers = computed(() => Array.from(usersMap.value.values()));
  const getUserById = (userId: number | string): UserModel | null => {
    return usersMap.value.get(userId) ?? null;
  };
  const getAdminUsers = computed(() =>
    getAllUsers.value.filter((user) => user.level === SecurityLevel.ADMIN)
  );

  /**
   * Provides a consistent color for a user based on their ID or stored color.
   * @param userId The ID of the user.
   * @returns A hex color string.
   */
  const userColorFromId = (userId: number): string => {
    const user = getUserById(userId);
    const DEFAULT_COLORS = ['#fc842c', '#b43893', '#c98963', '#4e8cd4', '#18bc91', '#cf454a'];
    if (!user || !user.color) {
      const numericId = typeof userId === 'string' ? parseInt(userId, 10) || 0 : userId;
      return DEFAULT_COLORS[numericId % DEFAULT_COLORS.length];
    }
    return user.color;
  };

  // --- Actions ---
  const apiStore = useApiStore();

  /**
   * Updates or adds a user to the local usersMap.
   * @param user The user model to update/add.
   */
  function _updateUserInMap(user: UserModel): void {
    if (user && user.id) {
      const newMap = new Map(usersMap.value);
      newMap.set(user.id, user);
      usersMap.value = newMap;
    }
  }

  /**
   * Handles authentication errors from API calls.
   * @param error The error object from the API call.
   * @param context A string describing the context of the error (e.g., 'login', 'fetchCurrentUser').
   * @throws An error message string or a ServerError instance.
   */
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

  /**
   * Sets the current user and updates their language preference if available.
   * Also updates the user in the local usersMap.
   * @param user The user model to set as current, or null to clear.
   */
  function _setCurrentUser(user: UserModel | null): void {
    currentUser.value = user;
    if (user) {
      _updateUserInMap(user);

      if (user.preferences?.language) {
        updateActiveLanguage(user.preferences.language.toLowerCase(), false);
      }
    }
  }

  /**
   * Initializes authentication status by checking for a stored token
   * and fetching the current user if a token exists.
   */
  async function initializeAuth(): Promise<void> {
    if (authStatusChecked.value) return;

    const storedToken = storageService.getAuthToken();
    if (storedToken) {
      try {
        const response = await apiStore.api.get('/api/v1/users/me');
        const user = UserModel.fromAPI(response.data.data);
        _setCurrentUser(user);
      } catch (error: any) {
        if (error.response?.status === 401 || error.message === 'BAD_CREDENTIALS') {
          storageService.removeAuthToken();
          _setCurrentUser(null);
        }
      }
    } else {
      _setCurrentUser(null);
    }
    authStatusChecked.value = true;
  }

  /**
   * Logs in a user with email and password.
   * Stores the auth token and fetches the current user on success.
   * @param credentials An object containing email and password.
   * @returns True if login was successful, otherwise throws an error.
   */
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
      authStatusChecked.value = true;
      return true;
    } catch (error) {
      console.error('[store login catch] Error during login process:', error);
      _handleAuthenticationError(error, 'login');
    }
  }

  /**
   * Logs out the current user.
   * Clears the auth token, resets user state, and redirects to the login page.
   */
  async function logout(): Promise<void> {
    if (isLoggingOut.value) return;

    isLoggingOut.value = true;
    console.warn('Logging out user...');

    try {
      if (token.value) {
        await apiStore.api.post('/api/v1/auth/logout', {
          skipAuthErrorInterceptor: true,
        });
      }
    } catch (error) {
      console.error('Error during API logout call:', error);
    } finally {
      storageService.removeAuthToken();
      PendingInterceptor.clearPendingCache();
      _setCurrentUser(null);
      usersMap.value.clear();
      usersFetched.value = false;
      authStatusChecked.value = false;
      isLoggingOut.value = false;
      router.push({ name: 'login', replace: true });
    }
  }

  /**
   * Changes an expired password for a user.
   * @param payload Object containing email, current password, and new password.
   */
  async function changeExpiredPassword({
    email,
    password,
    newPassword,
  }: {
    email: string;
    password: string;
    newPassword: string;
  }): Promise<void> {
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

  /**
   * Requests a password reset for the given email.
   * @param payload Object containing the user's email.
   */
  async function resetPassword({ email }: { email: string }): Promise<void> {
    try {
      await apiStore.api.post('/api/v1/auth/password/reset', {
        data: { email },
      });
    } catch (error) {
      _handleAuthenticationError(error, 'resetPassword');
    }
  }

  /**
   * Confirms a password reset using a code and new password.
   * @param payload Object containing the new password and reset code.
   */
  async function confirmResetPassword({ password, code }: { password: string; code: string }): Promise<void> {
    try {
      await apiStore.api.post(`/api/v1/auth/password/reset/${code}/confirm`, {
        data: { password },
      });
    } catch (error) {
      _handleAuthenticationError(error, 'confirmResetPassword');
    }
  }

  /**
   * Confirms a user's email/account using a confirmation code (e.g., after registration).
   * @param payload Object containing the confirmation code.
   */
  async function passwordConfirm({ code }: { code: string }): Promise<void> {
    try {
      await apiStore.api.post(`/api/v1/auth/password/${code}/confirm`);
    } catch (error) {
      throw new ServerError('users', 'passwordConfirm', error, { code });
    }
  }

  /**
   * Updates the password for a given user.
   * @param payload Object containing the user model and the new password.
   * @returns True if the updated user is the current user, false otherwise.
   * @throws ServerError if the API call fails.
   */
  async function updateUserPassword({
    user,
    password,
  }: {
    user: UserModel;
    password: string;
  }): Promise<boolean> {
    if (!user || !user.id) throw new Error('Valid user object with ID must be provided.');
    try {
      await apiStore.api.put(`/api/v1/users/${user.id}/password`, {
        data: { password },
        skipAuthErrorInterceptor: true,
      });

      return user.id === currentUserId.value;
    } catch (error: any) {
      throw new ServerError('users', 'updateUserPassword', error, { userId: user.id });
    }
  }

  /**
   * Fetches the currently authenticated user's data from the API.
   * Updates the local currentUser state.
   * @returns The UserModel of the current user, or null if fetch fails or no user is authenticated.
   */
  async function fetchCurrentUser(): Promise<UserModel | null> {
    try {
      const response = await apiStore.api.get('/api/v1/users/me');
      const user = UserModel.fromAPI(response.data.data);
      _setCurrentUser(user);
      return user;
    } catch (error) {
      storageService.removeAuthToken();
      _setCurrentUser(null);
      throw new ServerError('users', 'fetchCurrentUser', error);
    }
  }

  /**
   * Fetches a specific user by their ID.
   * Updates the user in the local usersMap and potentially the currentUser.
   * @param userId The ID of the user to fetch.
   * @returns The UserModel, or null if not found or an error occurs.
   */
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

  /**
   * Fetches all users from the API.
   * Populates the usersMap and sets usersFetched to true.
   */
  async function fetchUsers(): Promise<void> {
    if (!isAuthenticated.value) {
      return;
    }
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
  /**
   * Ensures that the list of users has been fetched.
   * Calls `fetchUsers` (debounced) if `usersFetched` is false.
   */
  async function ensureUsersFetched(): Promise<void> {
    if (!usersFetched.value) {
      await debouncedFetchUsers();
    }
  }

  /**
   * Searches for a user by ID or other identifier (e.g., email).
   * Checks local cache (usersMap) first if identifier is numeric.
   * @param identifier The user ID or other unique identifier.
   * @returns The UserModel if found, otherwise null.
   */
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

  /**
   * Updates a user's data on the server.
   * @param user The UserModel instance with updated data.
   * @returns The updated UserModel from the server.
   */
  async function updateUser(user: UserModel): Promise<UserModel> {
    const dataToSend: Partial<UserModel> = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      color: user.color,
    };

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

  /**
   * Adds a new user to the system.
   * @param userData The UserModel instance representing the new user.
   * @returns The newly created UserModel from the server.
   */
  async function addUser(userData: Partial<UserModel>): Promise<UserModel> {
    // Allow Partial for creation
    const dataToSend: Partial<UserModel> = {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
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
        throw new Error(`Error during user addition: ${error.response.data.message}`);
      }
      throw new ServerError('users', 'addUser', error, {
        email: userData.email,
      });
    }
  }

  /**
   * Deletes a user from the system.
   * If the deleted user is the current user, also logs out.
   * @param userId The ID of the user to delete.
   */
  async function deleteUser(userId: number | string): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    try {
      await apiStore.api.delete(`/api/v1/users/${userId}`);
      const newMap = new Map(usersMap.value);
      const deleted = newMap.delete(userId);
      if (deleted) {
        usersMap.value = newMap;
      }
      if (currentUser.value && currentUser.value.id === userId) {
        await logout();
      }
    } catch (error) {
      throw new ServerError('users', 'deleteUser', error, { userId });
    }
  }

  /**
   * Resets all preferences for a given user to their defaults (by deleting them on the server).
   * @param payload Object containing the user model.
   */
  async function resetPreferences({ user }: { user: UserModel }): Promise<void> {
    if (!user || !user.id) throw new Error('Valid user object with ID must be provided.');
    try {
      await apiStore.api.delete(`/api/v1/users/${user.id}/preferences`, {
        skipAuthErrorInterceptor: true,
      });
      if (currentUser.value && currentUser.value.id === user.id) {
        const updatedUser = currentUser.value.clone();
        updatedUser.preferences = null;
        _setCurrentUser(updatedUser);
      } else {
        const userInMap = usersMap.value.get(user.id);
        if (userInMap) {
          const updatedUserInMap = userInMap.clone();
          updatedUserInMap.preferences = null;
          _updateUserInMap(updatedUserInMap);
        }
      }
    } catch (error: any) {
      throw new ServerError('users', 'resetPreferences', error, { userId: user.id });
    }
  }

  /**
   * Sets a specific preference for the current user.
   * @param payload Object containing the preference key and value.
   */
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
    usersMap, // Exposed for testing or specific direct access scenarios
  };
});
