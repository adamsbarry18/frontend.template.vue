import { setActivePinia, createPinia } from 'pinia';
import { type Mock, type MockInstance } from 'vitest';
import { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { useUsersStore } from '../user';
import { useApiStore } from '@/stores/modules/api';
import UserModel, { SecurityLevel } from '../models/UserModel';
import router from '@/router';
import { storageService } from '@/libs/utils/StorageService';
import { PendingInterceptor } from '@/libs/interceptors/PendingInterceptor';
import { updateActiveLanguage } from '@/libs/utils/Language';

// Mock dependencies
vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
  },
}));

vi.mock('@/libs/utils/StorageService', () => ({
  storageService: {
    getAuthToken: vi.fn(),
    setAuthToken: vi.fn(),
    removeAuthToken: vi.fn(),
    setLanguage: vi.fn(),
    setItem: vi.fn(),
  },
}));

vi.mock('@/libs/interceptors/PendingInterceptor', () => ({
  PendingInterceptor: {
    clearPendingCache: vi.fn(),
  },
}));

vi.mock('@/libs/utils/Language', () => ({
  updateActiveLanguage: vi.fn(),
}));

// Helper pour créer une AxiosResponse mockée
const mockAxiosResponse = <T = any>(
  data: T,
  status: number = 200,
  statusText: string = 'OK',
  headers: any = {},
  config: InternalAxiosRequestConfig = {} as InternalAxiosRequestConfig
): AxiosResponse<T> => ({
  data,
  status,
  statusText,
  headers,
  config,
});

// Helper pour créer un AxiosError mocké
// Note: AxiosError est une classe complexe, ceci est une simplification pour les tests.
const mockAxiosError = (
  responseStatus: number,
  responseData?: any,
  statusText?: string,
  requestConfig?: InternalAxiosRequestConfig
): any => {
  const error = new Error(statusText || `Request failed with status code ${responseStatus}`) as any;
  error.isAxiosError = true;
  error.response = mockAxiosResponse(responseData || {}, responseStatus, statusText || 'Error');
  error.config = requestConfig || ({} as InternalAxiosRequestConfig);
  error.toJSON = () => ({}); // Pour la sérialisation si nécessaire
  return error;
};

// Mock UserModel statics and constructor if necessary
const mockUserFromAPI = vi.fn();
const mockUserToAPI = vi.fn();
const mockUserClone = vi.fn();
const mockUserSetPreference = vi.fn();

describe('stores/modules/users/user', () => {
  let usersStore: ReturnType<typeof useUsersStore>;
  let apiStore: ReturnType<typeof useApiStore>;

  const mockUser = new UserModel({
    id: 1,
    email: 'test@example.com',
    name: 'Test',
    surname: 'User',
    level: SecurityLevel.USER,
    preferences: { language: 'en' },
  }) as InstanceType<typeof UserModel>;

  const mockAdminUser = new UserModel({
    id: 2,
    email: 'admin@example.com',
    name: 'Admin',
    surname: 'User',
    level: SecurityLevel.ADMIN,
  }) as InstanceType<typeof UserModel>;

  beforeEach(() => {
    setActivePinia(createPinia());
    usersStore = useUsersStore();
    apiStore = useApiStore(); // Pinia auto-mocks stores, but we can spy on its methods

    // Reset mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    mockUserFromAPI.mockImplementation((data) => new UserModel(data));
    mockUserClone.mockImplementation(function (this: InstanceType<typeof UserModel>) {
      return new UserModel({ ...this });
    });
    (storageService.getAuthToken as Mock).mockReturnValue('mock-token');
  });

  describe('state', () => {
    it('initial state', () => {
      expect(usersStore.currentUser).toBeNull();
      expect(usersStore.usersFetched).toBe(false);
      expect(usersStore.authStatusChecked).toBe(false);
      expect(usersStore.getAllUsers).toEqual([]);
    });
  });

  describe('getters', () => {
    it('isAuthenticated', () => {
      expect(usersStore.isAuthenticated).toBe(false);
      usersStore.currentUser = mockUser;
      expect(usersStore.isAuthenticated).toBe(true);
    });

    it('currentUserId', () => {
      expect(usersStore.currentUserId).toBeNull();
      usersStore.currentUser = mockUser;
      expect(usersStore.currentUserId).toBe(1);
    });

    it('level', () => {
      expect(usersStore.level).toBe(SecurityLevel.EXTERNAL);
      usersStore.currentUser = mockUser;
      expect(usersStore.level).toBe(SecurityLevel.USER);
    });

    it('email', () => {
      expect(usersStore.email).toBeNull();
      usersStore.currentUser = mockUser;
      expect(usersStore.email).toBe('test@example.com');
    });

    it('token', () => {
      (storageService.getAuthToken as Mock).mockReturnValueOnce('test-token');
      expect(usersStore.token).toBe('test-token');
    });

    it('internal', () => {
      expect(usersStore.internal).toBe(false);
      usersStore.currentUser = new UserModel({ ...mockUser, internal: true });
      expect(usersStore.internal).toBe(true);
    });

    it('language', () => {
      expect(usersStore.language).toBe('en'); // Default if no user or no pref
      usersStore.currentUser = new UserModel({ ...mockUser, preferences: { language: 'fr' } });
      expect(usersStore.language).toBe('fr');
      usersStore.currentUser = new UserModel({ ...mockUser, preferences: { language: 'EN' } });
      expect(usersStore.language).toBe('en');
      usersStore.currentUser = new UserModel({ ...mockUser, preferences: null });
      expect(usersStore.language).toBe('en');
    });

    it('getInitial', () => {
      expect(usersStore.getInitial).toBe('-');
      usersStore.currentUser = new UserModel({ ...mockUser, name: 'John' });
      expect(usersStore.getInitial).toBe('J');
      usersStore.currentUser = new UserModel({ ...mockUser, name: null });
      expect(usersStore.getInitial).toBe('-');
    });

    it('getAllUsers', () => {
      expect(usersStore.getAllUsers).toEqual([]);
      usersStore.currentUser = mockUser; // to add it to usersMap via _setCurrentUser
      usersStore.usersMap.set(mockAdminUser.id, mockAdminUser);
      expect(usersStore.getAllUsers).toHaveLength(2);
      expect(usersStore.getAllUsers).toContain(mockUser);
      expect(usersStore.getAllUsers).toContain(mockAdminUser);
    });

    it('getUserById', () => {
      usersStore.usersMap.set(mockUser.id, mockUser);
      expect(usersStore.getUserById(1)).toEqual(mockUser);
      expect(usersStore.getUserById(99)).toBeNull();
    });

    it('getAdminUsers', () => {
      usersStore.usersMap.set(mockUser.id, mockUser);
      usersStore.usersMap.set(mockAdminUser.id, mockAdminUser);
      expect(usersStore.getAdminUsers).toEqual([mockAdminUser]);
    });

    it('userColorFromId', () => {
      const userWithColor = new UserModel({ id: 3, color: '#123456' });
      usersStore.usersMap.set(userWithColor.id, userWithColor);
      expect(usersStore.userColorFromId(3)).toBe('#123456');

      const DEFAULT_COLORS = ['#fc842c', '#b43893', '#c98963', '#4e8cd4', '#18bc91', '#cf454a'];
      expect(usersStore.userColorFromId(99)).toBe(DEFAULT_COLORS[99 % DEFAULT_COLORS.length]); // User not in map
      usersStore.usersMap.set(mockUser.id, new UserModel({ ...mockUser, color: null }));
      expect(usersStore.userColorFromId(mockUser.id)).toBe(
        DEFAULT_COLORS[mockUser.id % DEFAULT_COLORS.length]
      ); // User in map but no color
    });
  });

  describe('actions', () => {
    describe('initializeAuth', () => {
      it('should do nothing if authStatusChecked is true', async () => {
        usersStore.authStatusChecked = true;
        await usersStore.initializeAuth();
        expect(storageService.getAuthToken).not.toHaveBeenCalled();
      });

      it('should set currentUser to null if no token', async () => {
        (storageService.getAuthToken as Mock).mockReturnValueOnce(null);
        await usersStore.initializeAuth();
        expect(usersStore.currentUser).toBeNull();
        expect(usersStore.authStatusChecked).toBe(true);
        expect(apiStore.api.get).not.toHaveBeenCalled();
      });

      it('should fetch current user if token exists', async () => {
        const apiGetMock = vi
          .spyOn(apiStore.api, 'get')
          .mockResolvedValue(mockAxiosResponse({ data: mockUser }));
        mockUserFromAPI.mockReturnValueOnce(mockUser);

        await usersStore.initializeAuth();

        expect(storageService.getAuthToken).toHaveBeenCalled();
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/me');
        expect(mockUserFromAPI).toHaveBeenCalledWith(mockUser);
        expect(usersStore.currentUser).toEqual(mockUser);
        expect(usersStore.authStatusChecked).toBe(true);
        expect(updateActiveLanguage).toHaveBeenCalledWith('en', false);
      });

      it('should handle API error when fetching user with token', async () => {
        const apiGetMock = vi.spyOn(apiStore.api, 'get').mockRejectedValue(mockAxiosError(500));
        await usersStore.initializeAuth();
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/me');
        expect(usersStore.currentUser).toBeNull(); // Should not set user
        expect(usersStore.authStatusChecked).toBe(true); // Should still mark as checked
        expect(storageService.removeAuthToken).not.toHaveBeenCalled(); // Only on 401
      });

      it('should remove token and set user to null on 401 error', async () => {
        const apiGetMock = vi.spyOn(apiStore.api, 'get').mockRejectedValue(mockAxiosError(401));
        await usersStore.initializeAuth();
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/me');
        expect(storageService.removeAuthToken).toHaveBeenCalled();
        expect(usersStore.currentUser).toBeNull();
        expect(usersStore.authStatusChecked).toBe(true);
      });
    });

    describe('login', () => {
      const loginCredentials = { email: 'test@example.com', password: 'password' };

      it('should throw error if email or password is not provided', async () => {
        await expect(usersStore.login({ email: '', password: 'password' })).rejects.toThrow(
          'Email and password are required'
        );
        await expect(usersStore.login({ email: 'test@example.com', password: '' })).rejects.toThrow(
          'Email and password are required'
        );
      });

      it('should login successfully, set token, and fetch current user', async () => {
        const apiPostMock = vi
          .spyOn(apiStore.api, 'post')
          .mockResolvedValue(mockAxiosResponse({ token: 'new-token' }));
        const fetchCurrentUserSpy = vi.spyOn(usersStore, 'fetchCurrentUser').mockResolvedValue(mockUser);

        const result = await usersStore.login(loginCredentials);

        expect(result).toBe(true);
        expect(apiPostMock).toHaveBeenCalledWith('/api/v1/auth/login', {
          data: loginCredentials,
          skipAuthErrorInterceptor: true,
        });
        expect(storageService.setAuthToken).toHaveBeenCalledWith('new-token');
        expect(fetchCurrentUserSpy).toHaveBeenCalled();
        expect(usersStore.currentUser).toEqual(mockUser); // Assuming fetchCurrentUser sets it
      });

      it('should login successfully, set token (from data.data.token), and fetch current user', async () => {
        const apiPostMock = vi
          .spyOn(apiStore.api, 'post')
          .mockResolvedValue(mockAxiosResponse({ data: { token: 'new-data-token' } }));
        const fetchCurrentUserSpy = vi.spyOn(usersStore, 'fetchCurrentUser').mockResolvedValue(mockUser);

        const result = await usersStore.login(loginCredentials);

        expect(result).toBe(true);
        expect(apiPostMock).toHaveBeenCalledWith('/api/v1/auth/login', {
          data: loginCredentials,
          skipAuthErrorInterceptor: true,
        });
        expect(storageService.setAuthToken).toHaveBeenCalledWith('new-data-token');
        expect(fetchCurrentUserSpy).toHaveBeenCalled();
      });

      it('should handle login failure and throw specific error messages', async () => {
        const apiPostMock = vi
          .spyOn(apiStore.api, 'post')
          .mockRejectedValue(mockAxiosError(401, { message: 'Bad credentials' }));
        await expect(usersStore.login(loginCredentials)).rejects.toBe('Bad credentials');
        expect(apiPostMock).toHaveBeenCalledWith('/api/v1/auth/login', {
          data: loginCredentials,
          skipAuthErrorInterceptor: true,
        });

        apiPostMock.mockRejectedValueOnce(mockAxiosError(400, { code: 'VALIDATION_ERROR' }));
        await expect(usersStore.login(loginCredentials)).rejects.toBe('VALIDATION_ERROR');

        apiPostMock.mockRejectedValueOnce(mockAxiosError(500));
        await expect(usersStore.login(loginCredentials)).rejects.toThrow(Error); // ServerError
      });
    });

    describe('logout', () => {
      it('should logout user, clear token, reset state, and redirect', async () => {
        usersStore.currentUser = mockUser;
        usersStore.usersFetched = true;
        usersStore.authStatusChecked = true;
        usersStore.usersMap.set(mockUser.id, mockUser);
        (storageService.getAuthToken as Mock).mockReturnValue('some-token');

        const apiPostMock = vi.spyOn(apiStore.api, 'post').mockResolvedValue(mockAxiosResponse({}));

        await usersStore.logout();

        expect(apiPostMock).toHaveBeenCalledWith('/api/v1/auth/logout', { skipAuthErrorInterceptor: true });
        expect(storageService.removeAuthToken).toHaveBeenCalled();
        expect(PendingInterceptor.clearPendingCache).toHaveBeenCalled();
        expect(usersStore.currentUser).toBeNull();
        expect(usersStore.usersMap.size).toBe(0);
        expect(usersStore.usersFetched).toBe(false);
        expect(usersStore.authStatusChecked).toBe(false);
        expect(router.push).toHaveBeenCalledWith({ name: 'login', replace: true });
      });

      it('should not call api if no token', async () => {
        (storageService.getAuthToken as Mock).mockReturnValue(null);
        const apiPostMock = vi.spyOn(apiStore.api, 'post');
        await usersStore.logout();
        expect(apiPostMock).not.toHaveBeenCalled();
        expect(router.push).toHaveBeenCalledWith({ name: 'login', replace: true });
      });

      it('should handle logout API error but still clear local data', async () => {
        usersStore.currentUser = mockUser;
        (storageService.getAuthToken as Mock).mockReturnValue('some-token');
        const apiPostMock = vi.spyOn(apiStore.api, 'post').mockRejectedValue(new Error('API down'));

        await usersStore.logout();

        expect(apiPostMock).toHaveBeenCalled();
        expect(storageService.removeAuthToken).toHaveBeenCalled();
        expect(usersStore.currentUser).toBeNull();
        expect(router.push).toHaveBeenCalledWith({ name: 'login', replace: true });
      });

      it('should prevent multiple logout calls if one is in progress', async () => {
        (storageService.getAuthToken as Mock).mockReturnValue('some-token');
        const apiPostMock = vi.spyOn(apiStore.api, 'post').mockImplementation(() => {
          // Simulate ongoing request by usersStore.logout() being called again
          usersStore.logout();
          return Promise.resolve(mockAxiosResponse({}));
        });

        await usersStore.logout();
        expect(apiPostMock).toHaveBeenCalledTimes(1); // Should only be called once
      });
    });

    describe('fetchCurrentUser', () => {
      it('should fetch and set current user', async () => {
        const apiGetMock = vi
          .spyOn(apiStore.api, 'get')
          .mockResolvedValue(mockAxiosResponse({ data: mockUser }));
        mockUserFromAPI.mockReturnValueOnce(mockUser);

        const user = await usersStore.fetchCurrentUser();

        expect(user).toEqual(mockUser);
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/me');
        expect(mockUserFromAPI).toHaveBeenCalledWith(mockUser);
        expect(usersStore.currentUser).toEqual(mockUser);
        expect(usersStore.usersMap.get(mockUser.id)).toEqual(mockUser);
        expect(updateActiveLanguage).toHaveBeenCalledWith('en', false);
      });

      it('should handle error, clear token, and set user to null', async () => {
        const apiGetMock = vi.spyOn(apiStore.api, 'get').mockRejectedValue(new Error('Network error'));

        await expect(usersStore.fetchCurrentUser()).rejects.toThrow(Error); // ServerError
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/me');
        expect(storageService.removeAuthToken).toHaveBeenCalled();
        expect(usersStore.currentUser).toBeNull();
      });
    });

    describe('fetchUser', () => {
      it('should fetch a specific user and update map', async () => {
        const specificUser = new UserModel({ id: 2, email: 'specific@example.com' });
        const apiGetMock = vi
          .spyOn(apiStore.api, 'get')
          .mockResolvedValue(mockAxiosResponse({ data: specificUser }));
        mockUserFromAPI.mockReturnValueOnce(specificUser);

        const user = await usersStore.fetchUser(2);

        expect(user).toEqual(specificUser);
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/2');
        expect(mockUserFromAPI).toHaveBeenCalledWith(specificUser);
        expect(usersStore.usersMap.get(2)).toEqual(specificUser);
      });

      it('should update currentUser if fetched user is the current user', async () => {
        usersStore.currentUser = new UserModel({ ...mockUser, name: 'Old Name' }); // Current user exists
        const updatedCurrentUser = new UserModel({ ...mockUser, name: 'New Name' });
        const apiGetMock = vi
          .spyOn(apiStore.api, 'get')
          .mockResolvedValue(mockAxiosResponse({ data: updatedCurrentUser }));
        mockUserFromAPI.mockReturnValueOnce(updatedCurrentUser);

        await usersStore.fetchUser(mockUser.id);
        expect(apiGetMock).toHaveBeenCalledWith(`/api/v1/users/${mockUser.id}`);
        expect(usersStore.currentUser).toEqual(updatedCurrentUser);
        expect(updateActiveLanguage).toHaveBeenCalledTimes(2); // Once for initial set, once for update
      });

      it('should return null on 404 error', async () => {
        const apiGetMock = vi.spyOn(apiStore.api, 'get').mockRejectedValue(mockAxiosError(404));
        const user = await usersStore.fetchUser(99);
        expect(user).toBeNull();
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/99');
      });

      it('should throw ServerError for other errors', async () => {
        const apiGetMock = vi.spyOn(apiStore.api, 'get').mockRejectedValue(mockAxiosError(500));
        await expect(usersStore.fetchUser(3)).rejects.toThrow(Error); // ServerError
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/3');
      });
    });

    describe('fetchUsers', () => {
      it('should fetch all users, update map, and set usersFetched to true', async () => {
        const usersList = [mockUser, mockAdminUser];
        const apiGetMock = vi
          .spyOn(apiStore.api, 'get')
          .mockResolvedValue(mockAxiosResponse({ data: usersList }));
        mockUserFromAPI.mockImplementation((data) => new UserModel(data));

        await usersStore.fetchUsers();

        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users');
        expect(mockUserFromAPI).toHaveBeenCalledTimes(usersList.length);
        expect(usersStore.usersMap.size).toBe(usersList.length);
        expect(usersStore.usersMap.get(mockUser.id)).toEqual(mockUser);
        expect(usersStore.usersMap.get(mockAdminUser.id)).toEqual(mockAdminUser);
        expect(usersStore.usersFetched).toBe(true);
      });

      it('should throw ServerError on API failure', async () => {
        const apiGetMock = vi.spyOn(apiStore.api, 'get').mockRejectedValue(new Error('API error'));
        await expect(usersStore.fetchUsers()).rejects.toThrow(Error); // ServerError
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users');
        expect(usersStore.usersFetched).toBe(false);
      });
    });

    describe('ensureUsersFetched', () => {
      it('should call debounced fetchUsers if not fetched', async () => {
        usersStore.usersFetched = false;
        // We can't directly test the debounce easily without timers,
        // so we spy on the original fetchUsers which debounce will eventually call.
        const fetchUsersSpy = vi.spyOn(usersStore, 'fetchUsers').mockResolvedValue();

        await usersStore.ensureUsersFetched();
        // Due to debounce, direct call might not happen in sync tests.
        // This test ensures the logic path is taken.
        // For more precise debounce testing, vi.useFakeTimers() would be needed.
        // However, we trust debounce works and just check if fetchUsers is reachable.
        expect(fetchUsersSpy).toHaveBeenCalled();
      });

      it('should not call fetchUsers if already fetched', async () => {
        usersStore.usersFetched = true;
        const fetchUsersSpy = vi.spyOn(usersStore, 'fetchUsers');
        await usersStore.ensureUsersFetched();
        expect(fetchUsersSpy).not.toHaveBeenCalled();
      });
    });

    describe('searchUser', () => {
      it('should return cached user if found by ID', async () => {
        usersStore.usersMap.set(mockUser.id, mockUser);
        const apiGetMock = vi.spyOn(apiStore.api, 'get');
        const user = await usersStore.searchUser(mockUser.id);
        expect(user).toEqual(mockUser);
        expect(apiGetMock).not.toHaveBeenCalled();
      });

      it('should fetch user by ID if not cached', async () => {
        const apiGetMock = vi
          .spyOn(apiStore.api, 'get')
          .mockResolvedValue(mockAxiosResponse({ data: mockUser }));
        mockUserFromAPI.mockReturnValueOnce(mockUser);

        const user = await usersStore.searchUser(mockUser.id);
        expect(user).toEqual(mockUser);
        expect(apiGetMock).toHaveBeenCalledWith(`/api/v1/users/${mockUser.id}`);
        expect(usersStore.usersMap.get(mockUser.id)).toEqual(mockUser);
      });

      it('should fetch user by email (string identifier)', async () => {
        const apiGetMock = vi
          .spyOn(apiStore.api, 'get')
          .mockResolvedValue(mockAxiosResponse({ data: mockUser }));
        mockUserFromAPI.mockReturnValueOnce(mockUser);

        const user = await usersStore.searchUser(mockUser.email);
        expect(user).toEqual(mockUser);
        expect(apiGetMock).toHaveBeenCalledWith(`/api/v1/users/${mockUser.email}`);
      });

      it('should return null if API returns no data', async () => {
        const apiGetMock = vi.spyOn(apiStore.api, 'get').mockResolvedValue(mockAxiosResponse({ data: null }));
        const user = await usersStore.searchUser('nonexistent@example.com');
        expect(user).toBeNull();
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/nonexistent@example.com');
      });

      it('should return null on 403 or 404 error', async () => {
        const apiGetMock404 = vi.spyOn(apiStore.api, 'get').mockRejectedValue(mockAxiosError(404));
        expect(await usersStore.searchUser('notfound')).toBeNull();
        expect(apiGetMock404).toHaveBeenCalledWith('/api/v1/users/notfound');

        const apiGetMock403 = vi.spyOn(apiStore.api, 'get').mockRejectedValue(mockAxiosError(403));
        expect(await usersStore.searchUser('forbidden')).toBeNull();
        expect(apiGetMock403).toHaveBeenCalledWith('/api/v1/users/forbidden');
      });

      it('should throw ServerError for other errors', async () => {
        const apiGetMock = vi.spyOn(apiStore.api, 'get').mockRejectedValue(mockAxiosError(500));
        await expect(usersStore.searchUser('error')).rejects.toThrow(Error); // ServerError
        expect(apiGetMock).toHaveBeenCalledWith('/api/v1/users/error');
      });
    });

    describe('updateUser', () => {
      const userToUpdate = new UserModel({ ...mockUser, name: 'Original Name' });
      const updatedDataFromApi = { ...userToUpdate, name: 'Updated Name' };

      beforeEach(() => {
        // Reset the mock for toAPI for this specific test suite if needed
        mockUserToAPI.mockImplementation(function (this: InstanceType<typeof UserModel>) {
          const apiObject = { ...this };
          delete apiObject.id; // Simulating typical toAPI behavior
          delete apiObject.createdAt;
          delete apiObject.updatedAt;
          return apiObject;
        });
        mockUserFromAPI.mockImplementation((data) => new UserModel(data));
      });

      it('should update user, update map, and update currentUser if applicable', async () => {
        usersStore.currentUser = userToUpdate; // User being updated is current user
        usersStore.usersMap.set(userToUpdate.id, userToUpdate);

        const apiPutMock = vi
          .spyOn(apiStore.api, 'put')
          .mockResolvedValue(mockAxiosResponse({ data: updatedDataFromApi }));
        mockUserFromAPI.mockReturnValueOnce(new UserModel(updatedDataFromApi)); // API returns updated user

        const result = await usersStore.updateUser(new UserModel(userToUpdate));

        expect(result.name).toBe('Updated Name');
        expect(mockUserToAPI).toHaveBeenCalled();
        expect(apiPutMock).toHaveBeenCalledWith(`/api/v1/users/${userToUpdate.id}`, {
          data: expect.objectContaining({ name: 'Original Name' }), // Data sent to API
        });
        expect(usersStore.usersMap.get(userToUpdate.id)?.name).toBe('Updated Name');
        expect(usersStore.currentUser?.name).toBe('Updated Name');
        expect(updateActiveLanguage).toHaveBeenCalledTimes(2); // Initial set + update
      });

      it('should update user in map even if not current user', async () => {
        usersStore.currentUser = mockAdminUser; // A different user is logged in
        usersStore.usersMap.set(userToUpdate.id, userToUpdate);

        const apiPutMock = vi
          .spyOn(apiStore.api, 'put')
          .mockResolvedValue(mockAxiosResponse({ data: updatedDataFromApi }));
        mockUserFromAPI.mockReturnValueOnce(new UserModel(updatedDataFromApi));

        const originalToApiData = mockUserToAPI.getMockImplementation()?.call(new UserModel(userToUpdate));
        await usersStore.updateUser(new UserModel(userToUpdate));

        expect(apiPutMock).toHaveBeenCalledWith(`/api/v1/users/${userToUpdate.id}`, {
          data: originalToApiData,
        });
        expect(usersStore.usersMap.get(userToUpdate.id)?.name).toBe('Updated Name');
        expect(usersStore.currentUser?.id).toBe(mockAdminUser.id); // Current user unchanged
        expect(updateActiveLanguage).toHaveBeenCalledTimes(1); // Only for initial current user
      });

      it('should throw ServerError on API failure', async () => {
        const userToUpdateInstance = new UserModel(userToUpdate);
        const apiPutMock = vi.spyOn(apiStore.api, 'put').mockRejectedValue(new Error('API error'));
        await expect(usersStore.updateUser(userToUpdateInstance)).rejects.toThrow(Error); // ServerError
        expect(apiPutMock).toHaveBeenCalled();
      });
    });

    describe('addUser', () => {
      const newUserProto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New',
        surname: 'User',
        level: SecurityLevel.READER,
      };
      const newUserInstance = new UserModel(newUserProto);
      const apiReturnedUser = { ...newUserInstance, id: 99, createdAt: new Date() }; // Changed to Date object

      it('should add a new user and update map', async () => {
        const apiPostMock = vi
          .spyOn(apiStore.api, 'post')
          .mockResolvedValue(mockAxiosResponse({ data: apiReturnedUser }));
        // Ensure the mockUserFromAPI receives data that its constructor (MockUserModel) can handle
        // If MockUserModel expects a Date object for createdAt, apiReturnedUser is now correct.
        mockUserFromAPI.mockReturnValueOnce(new UserModel(apiReturnedUser as Partial<UserModel>));

        const result = await usersStore.addUser(newUserInstance);

        expect(result.id).toBe(99);
        expect(result.email).toBe(newUserProto.email);
        expect(apiPostMock).toHaveBeenCalledWith('/api/v1/users', {
          data: expect.objectContaining({ email: newUserProto.email, password: newUserProto.password }),
        });
        expect(usersStore.usersMap.get(99)?.email).toBe(newUserProto.email);
      });

      it('should throw specific error if API returns error message', async () => {
        const errorMessage = 'Email already exists';
        const apiPostMock = vi
          .spyOn(apiStore.api, 'post')
          .mockRejectedValue(mockAxiosError(400, { message: errorMessage })); // Assuming 400 for this error
        await expect(usersStore.addUser(newUserInstance)).rejects.toThrow(
          `Erreur lors de l'ajout : ${errorMessage}`
        );
        expect(apiPostMock).toHaveBeenCalledWith('/api/v1/users', {
          data: expect.objectContaining({ email: newUserProto.email, password: newUserProto.password }),
        });
      });

      it('should throw ServerError for other API failures', async () => {
        const apiPostMock = vi.spyOn(apiStore.api, 'post').mockRejectedValue(new Error('Network issue'));
        await expect(usersStore.addUser(newUserInstance)).rejects.toThrow(Error); // ServerError
        expect(apiPostMock).toHaveBeenCalled();
      });
    });

    describe('deleteUser', () => {
      it('should delete user, remove from map', async () => {
        usersStore.usersMap.set(mockUser.id, mockUser);
        const apiDeleteMock = vi.spyOn(apiStore.api, 'delete') as MockInstance<
          (url: string, config?: any) => Promise<AxiosResponse<any>>
        >;
        apiDeleteMock.mockResolvedValue(mockAxiosResponse({}));

        await usersStore.deleteUser(mockUser.id);

        expect(apiDeleteMock).toHaveBeenCalledWith(`/api/v1/users/${mockUser.id}`);
        expect(usersStore.usersMap.has(mockUser.id)).toBe(false);
      });

      it('should logout if deleted user is current user', async () => {
        usersStore.currentUser = mockUser;
        usersStore.usersMap.set(mockUser.id, mockUser);
        (storageService.getAuthToken as Mock).mockReturnValue('token'); // For logout to call API

        const apiDeleteMock = vi.spyOn(apiStore.api, 'delete') as MockInstance<
          (url: string, config?: any) => Promise<AxiosResponse<any>>
        >;
        apiDeleteMock.mockResolvedValue(mockAxiosResponse({}));
        const logoutSpy = vi.spyOn(usersStore, 'logout').mockResolvedValue(); // Spy on the action

        await usersStore.deleteUser(mockUser.id);

        expect(apiDeleteMock).toHaveBeenCalled();
        expect(logoutSpy).toHaveBeenCalled();
      });

      it('should throw error if no userId is provided', async () => {
        await expect(usersStore.deleteUser('')).rejects.toThrow('User ID is required');
      });

      it('should throw ServerError on API failure', async () => {
        usersStore.usersMap.set(mockUser.id, mockUser);
        const apiDeleteMock = vi.spyOn(apiStore.api, 'delete').mockRejectedValue(new Error('API error'));
        await expect(usersStore.deleteUser(mockUser.id)).rejects.toThrow(Error); // ServerError
        expect(apiDeleteMock).toHaveBeenCalled();
      });
    });

    describe('setPreference', () => {
      it('should do nothing if no current user', async () => {
        usersStore.currentUser = null;
        const apiPutMock = vi.spyOn(apiStore.api, 'put');
        await usersStore.setPreference({ key: 'theme', value: 'dark' });
        expect(apiPutMock).not.toHaveBeenCalled();
      });

      it('should update preference for current user, update user model, and call API', async () => {
        const initialUser = new UserModel({ ...mockUser, preferences: { language: 'en' } });
        usersStore.currentUser = initialUser;
        mockUserClone.mockReturnValue(new UserModel({ ...initialUser })); // Ensure clone returns a new instance

        const apiPutMock = vi.spyOn(apiStore.api, 'put').mockResolvedValue(mockAxiosResponse({}));

        await usersStore.setPreference({ key: 'theme', value: 'dark' });

        expect(apiPutMock).toHaveBeenCalledWith(`/api/v1/users/${initialUser.id}/preferences/theme`, {
          data: { value: 'dark' },
        });
        expect(mockUserClone).toHaveBeenCalled();
        expect(mockUserSetPreference).toHaveBeenCalledWith('theme', 'dark');
        expect(usersStore.currentUser?.getPreference('theme')).toBe('dark'); // Assuming setPreference on mock works
        expect(storageService.setItem).toHaveBeenCalledWith('theme', 'dark');
      });

      it('should update language and call storageService if key is language', async () => {
        const initialUser = new UserModel({ ...mockUser, preferences: { theme: 'light' } });
        usersStore.currentUser = initialUser;
        mockUserClone.mockReturnValue(new UserModel({ ...initialUser }));

        const apiPutMock = vi.spyOn(apiStore.api, 'put').mockResolvedValue(mockAxiosResponse({}));

        await usersStore.setPreference({ key: 'language', value: 'FR' });

        expect(apiPutMock).toHaveBeenCalledWith(`/api/v1/users/${initialUser.id}/preferences/language`, {
          data: { value: 'FR' },
        });
        expect(mockUserSetPreference).toHaveBeenCalledWith('language', 'FR');
        expect(updateActiveLanguage).toHaveBeenCalledWith('fr', false);
        expect(storageService.setLanguage).toHaveBeenCalledWith('fr');
      });

      it('should throw ServerError on API failure', async () => {
        usersStore.currentUser = mockUser;
        mockUserClone.mockReturnValue(new UserModel({ ...mockUser }));
        const apiPutMock = vi.spyOn(apiStore.api, 'put').mockRejectedValue(new Error('API error'));

        await expect(usersStore.setPreference({ key: 'theme', value: 'dark' })).rejects.toThrow(Error); // ServerError
        expect(apiPutMock).toHaveBeenCalled();
      });
    });

    // TODO: Add tests for:
    // - changeExpiredPassword
    // - resetPassword
    // - confirmResetPassword
    // - passwordConfirm
    // - updateUserPassword
    // - resetPreferences
    // - _handleAuthenticationError (indirectly tested, but could have direct tests for edge cases)
    // - _setCurrentUser (indirectly tested)
    // - _updateUserInMap (indirectly tested)
  });
});
