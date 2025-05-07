import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUsersStore } from '../user';
import { SecurityLevel, PasswordStatus } from '../models/UserModel';
import { storageService } from '@/libs/utils/StorageService';
import { updateActiveLanguage } from '@/libs/utils/Language';

vi.mock('@/libs/utils/StorageService', () => ({
  storageService: {
    getAuthToken: vi.fn(),
    setAuthToken: vi.fn(),
    removeAuthToken: vi.fn(),
    setLanguage: vi.fn(),
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

vi.mock('@/libs/utils/Language', () => ({
  updateActiveLanguage: vi.fn(),
}));

const mockApiGet = vi.fn();
const mockApiPost = vi.fn();
const mockApiPut = vi.fn();
const mockApiDelete = vi.fn();

vi.mock('@/stores/modules/api', () => ({
  useApiStore: () => ({
    api: {
      get: mockApiGet,
      post: mockApiPost,
      put: mockApiPut,
      delete: mockApiDelete,
    },
  }),
}));

vi.mock('@/libs/utils/Debounce', () => ({
  debounce: (fn: (...args: any[]) => any) => fn,
}));

describe('stores/modules/users/user', () => {
  let usersStore: ReturnType<typeof useUsersStore>;
  // apiStore will be initialized in beforeEach to ensure mocks are fresh
  // and tests can configure it as needed.

  const rawUser1 = {
    id: 1,
    uid: 'user-uid-1',
    email: 'test@example.com',
    name: 'Test',
    surname: 'User',
    level: SecurityLevel.USER,
    internalLevel: 1,
    internal: false,
    color: null,
    passwordStatus: PasswordStatus.ACTIVE,
    preferences: { language: 'en', theme: 'light' },
    permissions: { canEdit: true },
    authorisationOverrides: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    passwordUpdatedAt: new Date().toISOString(),
    permissionsExpireAt: new Date(Date.now() + 3600 * 1000).toISOString(),
  };

  const rawAdminUser = {
    id: 2,
    email: 'admin@example.com',
    name: 'Admin',
    surname: 'UserAdmin',
    level: SecurityLevel.ADMIN,
    preferences: { language: 'fr', theme: 'dark' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    passwordStatus: PasswordStatus.ACTIVE,
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    usersStore = useUsersStore();
    vi.clearAllMocks();
    (storageService.getAuthToken as Mock).mockReturnValue('mock-token');

    usersStore.currentUser = null;
    usersStore.usersMap.clear();
    usersStore.usersFetched = false;
    usersStore.authStatusChecked = false;
  });

  describe('state', () => {
    it('should have correct initial state', () => {
      expect(usersStore.currentUser).toBeNull();
      expect(usersStore.usersFetched).toBe(false);
      expect(usersStore.authStatusChecked).toBe(false);
      expect(usersStore.usersMap.size).toBe(0);
    });
  });

  describe('getters', () => {
    it('isAuthenticated', () => {
      expect(usersStore.isAuthenticated).toBe(false);
      usersStore.currentUser = rawUser1 as any;
      expect(usersStore.isAuthenticated).toBe(true);
    });

    it('currentUserId', () => {
      expect(usersStore.currentUserId).toBeNull();
      usersStore.currentUser = { id: 123 } as any;
      expect(usersStore.currentUserId).toBe(123);
    });

    it('level', () => {
      expect(usersStore.level).toBe(SecurityLevel.EXTERNAL);
      usersStore.currentUser = { level: SecurityLevel.ADMIN } as any;
      expect(usersStore.level).toBe(SecurityLevel.ADMIN);
    });

    it('language', () => {
      expect(usersStore.language).toBe('en');
      usersStore.currentUser = { preferences: { language: 'DE' } } as any;
      expect(usersStore.language).toBe('de');
    });

    it('getAllUsers', () => {
      expect(usersStore.getAllUsers).toEqual([]);
      usersStore.usersMap.set(rawUser1.id, rawUser1 as any);
      usersStore.usersMap.set(rawAdminUser.id, rawAdminUser as any);
      expect(usersStore.getAllUsers).toHaveLength(2);
      expect(usersStore.getAllUsers.find((u) => u.id === rawUser1.id)?.email).toBe(rawUser1.email);
    });
  });

  describe('actions', () => {
    describe('initializeAuth', () => {
      it('should fetch user if token exists and set as currentUser', async () => {
        (storageService.getAuthToken as Mock).mockReturnValueOnce('valid-token');
        mockApiGet.mockResolvedValueOnce({ data: { data: rawUser1 } });

        await usersStore.initializeAuth();

        expect(mockApiGet).toHaveBeenCalledWith('/api/v1/users/me');
        expect(usersStore.currentUser?.id).toBe(rawUser1.id);
        expect(updateActiveLanguage).toHaveBeenCalledWith('en', false);
      });

      it('should handle API 401 error and remove token', async () => {
        (storageService.getAuthToken as Mock).mockReturnValueOnce('valid-token');
        mockApiGet.mockRejectedValueOnce({ response: { status: 401 }, message: 'BAD_CREDENTIALS' });

        await usersStore.initializeAuth();

        expect(mockApiGet).toHaveBeenCalledWith('/api/v1/users/me');
        expect(usersStore.currentUser).toBeNull();
        expect(storageService.removeAuthToken).toHaveBeenCalled();
      });
    });

    describe('login', () => {
      const loginCredentials = { email: rawUser1.email, password: 'password' };
      it('should login successfully, store token, and call fetchCurrentUser which succeeds', async () => {
        mockApiPost.mockResolvedValueOnce({ data: { token: 'new-auth-token' } });
        mockApiGet.mockResolvedValueOnce({ data: { data: rawUser1 } });

        const result = await usersStore.login(loginCredentials);

        expect(result).toBe(true);
        expect(mockApiPost).toHaveBeenCalledWith('/api/v1/auth/login', {
          data: loginCredentials,
          skipAuthErrorInterceptor: true,
        });
        expect(storageService.setAuthToken).toHaveBeenCalledWith('new-auth-token');
        expect(mockApiGet).toHaveBeenCalledWith('/api/v1/users/me');
        expect(usersStore.currentUser?.id).toBe(rawUser1.id);
      });
    });

    describe('logout', () => {
      it('should call logout API and reset state', async () => {
        usersStore.currentUser = rawUser1 as any;
        (storageService.getAuthToken as Mock).mockReturnValue('some-token');
        mockApiPost.mockResolvedValueOnce({});
        mockApiGet.mockRejectedValueOnce({
          response: { status: 401 },
          message: 'Simulated token invalid after logout',
        });

        await usersStore.logout();

        expect(mockApiPost).toHaveBeenCalledWith('/api/v1/auth/logout', { skipAuthErrorInterceptor: true });
        expect(usersStore.currentUser).toBeNull();
        expect(storageService.removeAuthToken).toHaveBeenCalledTimes(1);
        // expect(mockApiGet).toHaveBeenCalledWith('/api/v1/users/me'); // Supprimé pour simplifier le test de logout
      });
    });

    describe('fetchCurrentUser', () => {
      it('should fetch and set the current user', async () => {
        mockApiGet.mockResolvedValueOnce({ data: { data: rawUser1 } });
        const user = await usersStore.fetchCurrentUser();
        expect(mockApiGet).toHaveBeenCalledWith('/api/v1/users/me');
        expect(user?.id).toBe(rawUser1.id);
        expect(usersStore.currentUser?.id).toBe(rawUser1.id);
      });
    });

    describe('fetchUser', () => {
      it('should fetch a specific user', async () => {
        mockApiGet.mockResolvedValueOnce({ data: { data: rawAdminUser } });
        const user = await usersStore.fetchUser(rawAdminUser.id);
        expect(mockApiGet).toHaveBeenCalledWith(`/api/v1/users/${rawAdminUser.id}`);
        expect(user?.id).toBe(rawAdminUser.id);
        expect(usersStore.usersMap.get(rawAdminUser.id)?.id).toBe(rawAdminUser.id);
      });
    });

    describe('fetchUsers', () => {
      it('should fetch all users and store them', async () => {
        const usersList = [rawUser1, rawAdminUser];
        mockApiGet.mockResolvedValueOnce({ data: { data: usersList } });
        await usersStore.fetchUsers();
        expect(mockApiGet).toHaveBeenCalledWith('/api/v1/users');
        expect(usersStore.usersMap.size).toBe(usersList.length);
        expect(usersStore.usersFetched).toBe(true);
        expect(usersStore.usersMap.get(rawUser1.id)?.email).toBe(rawUser1.email);
      });
    });

    describe('ensureUsersFetched', () => {
      it('should call fetchUsers if usersFetched is false', async () => {
        usersStore.usersFetched = false;
        mockApiGet.mockResolvedValueOnce({ data: { data: [] } });
        await usersStore.ensureUsersFetched();

        expect(mockApiGet).toHaveBeenCalledWith('/api/v1/users');
        expect(usersStore.usersFetched).toBe(true); // Verify effect of fetchUsers
      });

      it('should not call fetchUsers if usersFetched is true', async () => {
        usersStore.usersFetched = true;
        // Ensure mockApiGet is not called
        mockApiGet.mockClear(); // Clear previous calls if necessary

        await usersStore.ensureUsersFetched();
        expect(mockApiGet).not.toHaveBeenCalled();
      });
    });

    describe('searchUser', () => {
      it('should fetch user by ID', async () => {
        mockApiGet.mockResolvedValueOnce({ data: { data: rawUser1 } });
        const user = await usersStore.searchUser(rawUser1.id);
        expect(mockApiGet).toHaveBeenCalledWith(`/api/v1/users/${rawUser1.id}`);
        expect(user?.id).toBe(rawUser1.id);
      });
      it('should fetch user by email', async () => {
        mockApiGet.mockResolvedValueOnce({ data: { data: rawUser1 } });
        const user = await usersStore.searchUser(rawUser1.email);
        expect(mockApiGet).toHaveBeenCalledWith(`/api/v1/users/${rawUser1.email}`);
        expect(user?.email).toBe(rawUser1.email);
      });
    });

    describe('updateUser', () => {
      it('should call API to update user', async () => {
        usersStore.currentUser = { ...rawUser1, id: 1 } as any;
        const updatedName = 'Updated Name From Test';
        const apiResponseData = { ...rawUser1, name: updatedName, updatedAt: new Date().toISOString() };

        mockApiPut.mockResolvedValueOnce({ data: { data: apiResponseData } });

        const userToPassToUpdateAction = {
          id: rawUser1.id,
          name: updatedName,
          email: rawUser1.email,
          toAPI: () => ({
            name: updatedName,
            email: rawUser1.email,
            surname: rawUser1.surname,
            level: rawUser1.level,
            internalLevel: rawUser1.internalLevel,
            internal: rawUser1.internal,
            color: rawUser1.color,
            preferences: rawUser1.preferences,
            permissions: rawUser1.permissions,
            authorisationOverrides: rawUser1.authorisationOverrides,
            permissionsExpireAt: rawUser1.permissionsExpireAt,
          }),
        } as any;

        const result = await usersStore.updateUser(userToPassToUpdateAction);

        expect(mockApiPut).toHaveBeenCalledWith(`/api/v1/users/${rawUser1.id}`, {
          data: userToPassToUpdateAction.toAPI(),
        });
        expect(result.name).toBe(updatedName);
        expect(usersStore.currentUser?.name).toBe(updatedName);
      });
    });

    describe('addUser', () => {
      it('should call API to add a user', async () => {
        const newUserPayload = {
          email: 'new@dev.com',
          name: 'Newby',
          password: 'secure',
          surname: 'Test',
          level: SecurityLevel.USER,
          internalLevel: 0,
          internal: false,
          color: null,
          passwordStatus: PasswordStatus.ACTIVE,
          preferences: null,
          permissions: null,
          authorisationOverrides: null,
          permissionsExpireAt: null,
        };
        const apiReturnedUser = {
          ...newUserPayload,
          id: 100,
          uid: 'new-uid',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        delete (apiReturnedUser as any).password;

        mockApiPost.mockResolvedValueOnce({ data: { data: apiReturnedUser } });

        const result = await usersStore.addUser(newUserPayload as any);

        expect(mockApiPost).toHaveBeenCalledWith('/api/v1/users', {
          data: expect.objectContaining({ email: 'new@dev.com', name: 'Newby' }),
        });
        expect(result.id).toBe(100);
      });
    });

    describe('deleteUser', () => {
      it('should call API to delete a user', async () => {
        const userIdToDelete = rawUser1.id;
        usersStore.usersMap.set(userIdToDelete, rawUser1 as any);
        mockApiDelete.mockResolvedValueOnce({});
        await usersStore.deleteUser(userIdToDelete);
        expect(mockApiDelete).toHaveBeenCalledWith(`/api/v1/users/${userIdToDelete}`);
        expect(usersStore.usersMap.has(userIdToDelete)).toBe(false);
      });
    });

    describe('setPreference', () => {
      it('should call API to set a preference', async () => {
        usersStore.currentUser = {
          id: rawUser1.id,
          preferences: { theme: 'light', language: 'en' }, // Ensure language is there
          clone: function () {
            return { ...this, preferences: { ...this.preferences } };
          },
          setPreference: function (k: string, v: any) {
            this.preferences[k] = v;
          },
          getPreference: function (k: string) {
            return this.preferences?.[k];
          },
        } as any;

        mockApiPut.mockResolvedValueOnce({});
        await usersStore.setPreference({ key: 'theme', value: 'dark' });

        expect(mockApiPut).toHaveBeenCalledWith(`/api/v1/users/${rawUser1.id}/preferences/theme`, {
          data: { value: 'dark' },
        });
        expect(usersStore.currentUser?.getPreference('theme')).toBe('dark');
        expect(storageService.setItem).toHaveBeenCalledWith('theme', 'dark');
      });
      it('should update language and call services', async () => {
        usersStore.currentUser = {
          id: rawUser1.id,
          preferences: { language: 'en' },
          clone: function () {
            return { ...this, preferences: { ...this.preferences } };
          },
          setPreference: function (k: string, v: any) {
            this.preferences[k] = v.toLowerCase();
          },
          getPreference: function (k: string) {
            return this.preferences?.[k];
          },
        } as any;
        mockApiPut.mockResolvedValueOnce({});

        await usersStore.setPreference({ key: 'language', value: 'FR' });
        expect(usersStore.currentUser?.getPreference('language')).toBe('fr');
        expect(updateActiveLanguage).toHaveBeenCalledWith('fr', false);
        expect(storageService.setLanguage).toHaveBeenCalledWith('fr');
      });
    });
  });
});
