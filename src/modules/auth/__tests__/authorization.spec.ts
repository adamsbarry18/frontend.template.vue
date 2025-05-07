import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { ref, computed } from 'vue';
import { ServerError } from '@/libs/utils/Errors';
import { setActivePinia, createPinia } from 'pinia';
import { useUsersStore } from '@/stores/modules/users/user';
import { SecurityLevel } from '@/stores/modules/users/models/UserModel';
import dayjs from 'dayjs';
import { useAuthorisationsStore } from '@/stores/modules/auth/authorisations';

// Mock des dépendances externes
vi.mock('@/stores/modules/users/user', () => ({
  useUsersStore: vi.fn(),
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

describe('stores/modules/auth/authorisations', () => {
  let authorisationsStore: ReturnType<typeof useAuthorisationsStore>;
  let mockUsersStore: {
    currentUser: import('vue').Ref<any>;
    isAuthenticated: import('vue').ComputedRef<boolean>;
  };

  // Données utilisateur simulées pour les tests des getters
  const mockUser = {
    id: 1,
    level: SecurityLevel.USER,
    internalLevel: 1,
    internal: false,
    permissions: {
      featureA: ['read', 'write'],
      featureB: ['read'],
    },
    permissionsExpireAt: dayjs().add(1, 'day').toISOString(), // Non expiré
  };

  const mockAdminUser = {
    id: 2,
    level: SecurityLevel.ADMIN,
    internalLevel: 5,
    internal: true,
    permissions: {}, // L'admin a toutes les permissions implicitement
    permissionsExpireAt: null, // N'expire jamais
  };

  const mockExpiredUser = {
    id: 3,
    level: SecurityLevel.USER,
    internalLevel: 1,
    internal: false,
    permissions: {
      featureA: ['read'],
    },
    permissionsExpireAt: dayjs().subtract(1, 'day').toISOString(),
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    mockUsersStore = {
      currentUser: ref(null),
      isAuthenticated: computed(() => !!mockUsersStore.currentUser.value),
    } as any;
    (useUsersStore as unknown as Mock).mockReturnValue(mockUsersStore);

    authorisationsStore = useAuthorisationsStore();

    // Réinitialiser les mocks d'API
    vi.clearAllMocks();

    authorisationsStore.features = null;
    authorisationsStore.levelsAuthorisations = null;
  });

  describe('initial state', () => {
    it('should have a null initial state for features and levelsAuthorisations', () => {
      expect(authorisationsStore.features).toBeNull();
      expect(authorisationsStore.levelsAuthorisations).toBeNull();
    });
  });

  describe('getters', () => {
    describe('user context getters', () => {
      it('should return default values when no user is logged in', () => {
        mockUsersStore.currentUser.value = null;
        expect(authorisationsStore.level).toBe(SecurityLevel.EXTERNAL);
        expect(authorisationsStore.internalLevel).toBe(1);
        expect(authorisationsStore.internal).toBe(false);
        expect(authorisationsStore.permissionsExpireAt).toBeNull();
        expect(authorisationsStore.hasExpired).toBe(false);
      });

      it('should reflect currentUser properties', () => {
        mockUsersStore.currentUser.value = mockUser as any;
        expect(authorisationsStore.level).toBe(mockUser.level);
        expect(authorisationsStore.internalLevel).toBe(mockUser.internalLevel);
        expect(authorisationsStore.internal).toBe(mockUser.internal);
        expect(authorisationsStore.permissionsExpireAt?.toISOString()).toBe(mockUser.permissionsExpireAt);
      });
    });

    describe('hasExpired', () => {
      it('should be false if permissionsExpireAt is null', () => {
        mockUsersStore.currentUser.value = mockAdminUser as any;
        expect(authorisationsStore.hasExpired).toBe(false);
      });

      it('should be false if permissionsExpireAt is in the future', () => {
        mockUsersStore.currentUser.value = mockUser as any;
        expect(authorisationsStore.hasExpired).toBe(false);
      });

      it('should be true if permissionsExpireAt is in the past', () => {
        mockUsersStore.currentUser.value = mockExpiredUser as any;
        expect(authorisationsStore.hasExpired).toBe(true);
      });
    });

    describe('role getters', () => {
      it('isUser should be true for USER level and above', () => {
        mockUsersStore.currentUser.value = { level: SecurityLevel.USER } as any;
        expect(authorisationsStore.isUser).toBe(true);
        mockUsersStore.currentUser.value = { level: SecurityLevel.ADMIN } as any;
        expect(authorisationsStore.isUser).toBe(true);
        mockUsersStore.currentUser.value = { level: SecurityLevel.EXTERNAL } as any;
        expect(authorisationsStore.isUser).toBe(false);
      });

      it('isIntegrator should be true for INTEGRATOR level and above', () => {
        mockUsersStore.currentUser.value = { level: SecurityLevel.INTEGRATOR } as any;
        expect(authorisationsStore.isIntegrator).toBe(true);
        mockUsersStore.currentUser.value = { level: SecurityLevel.ADMIN } as any;
        expect(authorisationsStore.isIntegrator).toBe(true);
        mockUsersStore.currentUser.value = { level: SecurityLevel.USER } as any;
        expect(authorisationsStore.isIntegrator).toBe(false);
      });

      it('isAdmin should be true for ADMIN level', () => {
        mockUsersStore.currentUser.value = { level: SecurityLevel.ADMIN } as any;
        expect(authorisationsStore.isAdmin).toBe(true);
        mockUsersStore.currentUser.value = { level: SecurityLevel.INTEGRATOR } as any;
        expect(authorisationsStore.isAdmin).toBe(false);
      });
    });

    describe('hasCurrentUserAuthorisation (and isUserAllowed)', () => {
      it('should return true for admin for any feature/action', () => {
        mockUsersStore.currentUser.value = mockAdminUser as any;
        expect(authorisationsStore.hasCurrentUserAuthorisation('anyFeature', 'anyAction')).toBe(true);
        expect(authorisationsStore.isUserAllowed('anyFeature', 'anyAction')).toBe(true);
      });

      it('should return false if no user is logged in', () => {
        mockUsersStore.currentUser.value = null;
        expect(authorisationsStore.hasCurrentUserAuthorisation('featureA', 'read')).toBe(false);
      });

      it('should return false if user has no permissions object', () => {
        mockUsersStore.currentUser.value = { ...mockUser, permissions: null } as any;
        expect(authorisationsStore.hasCurrentUserAuthorisation('featureA', 'read')).toBe(false);
      });

      it('should return false if user does not have the feature permission', () => {
        mockUsersStore.currentUser.value = mockUser as any;
        expect(authorisationsStore.hasCurrentUserAuthorisation('featureC', 'read')).toBe(false);
      });

      it('should return false if user has the feature but not the action', () => {
        mockUsersStore.currentUser.value = mockUser as any;
        expect(authorisationsStore.hasCurrentUserAuthorisation('featureB', 'write')).toBe(false);
      });

      it('should return true if user has the feature and action', () => {
        mockUsersStore.currentUser.value = mockUser as any;
        expect(authorisationsStore.hasCurrentUserAuthorisation('featureA', 'read')).toBe(true);
        expect(authorisationsStore.hasCurrentUserAuthorisation('featureA', 'write')).toBe(true);
      });

      it('should still check permissions even if hasExpired is true (permissions check is independent of expiry for this getter)', () => {
        mockUsersStore.currentUser.value = mockExpiredUser as any;
        expect(authorisationsStore.hasCurrentUserAuthorisation('featureA', 'read')).toBe(true);
      });
    });
  });

  describe('actions', () => {
    const mockFeaturesData = {
      featureA: ['read', 'write', 'delete'],
      featureB: ['read', 'execute'],
    };
    const mockLevelsData = {
      [SecurityLevel.USER]: { featureA: ['read'] },
      [SecurityLevel.ADMIN]: { featureA: ['read', 'write', 'delete'], featureB: ['read', 'execute'] },
    };

    describe('fetchAllFeatures', () => {
      it('should fetch and set all features', async () => {
        mockApiGet.mockResolvedValueOnce({ data: { data: mockFeaturesData } });
        const result = await authorisationsStore.fetchAllFeatures();
        expect(mockApiGet).toHaveBeenCalledWith('/api/v1/authorization/features');
        expect(authorisationsStore.features).toEqual(mockFeaturesData);
        expect(result).toEqual(mockFeaturesData);
      });

      it('should return null on 403 error', async () => {
        mockApiGet.mockRejectedValueOnce({ response: { status: 403 } });
        const result = await authorisationsStore.fetchAllFeatures();
        expect(result).toBeNull();
        expect(authorisationsStore.features).toBeNull();
      });

      it('should throw ServerError on other errors', async () => {
        mockApiGet.mockRejectedValueOnce({ response: { status: 500 }, message: 'Server Error' });
        await expect(authorisationsStore.fetchAllFeatures()).rejects.toThrow(ServerError);
      });
    });

    describe('fetchLevels', () => {
      it('should fetch and set levels authorisations', async () => {
        mockApiGet.mockResolvedValueOnce({ data: { data: mockLevelsData } });
        const result = await authorisationsStore.fetchLevels();
        expect(mockApiGet).toHaveBeenCalledWith('/api/v1/authorization/levels');
        expect(authorisationsStore.levelsAuthorisations).toEqual(mockLevelsData);
        expect(result).toEqual(mockLevelsData);
      });

      it('should return null on 403 error', async () => {
        mockApiGet.mockRejectedValueOnce({ response: { status: 403 } });
        const result = await authorisationsStore.fetchLevels();
        expect(result).toBeNull();
      });
    });

    describe('getLevel', () => {
      it('should fetch authorisations for a specific level', async () => {
        const specificLevelData = { featureA: ['read', 'write'] };
        mockApiGet.mockResolvedValueOnce({ data: { data: specificLevelData } });
        const result = await authorisationsStore.getLevel(SecurityLevel.INTEGRATOR);
        expect(mockApiGet).toHaveBeenCalledWith(`/api/v1/authorization/levels/${SecurityLevel.INTEGRATOR}`);
        expect(result).toEqual(specificLevelData);
      });

      it('should return null on 403 error', async () => {
        mockApiGet.mockRejectedValueOnce({ response: { status: 403 } });
        const result = await authorisationsStore.getLevel(SecurityLevel.USER);
        expect(result).toBeNull();
      });
    });

    describe('getUserAuthorisations', () => {
      const userId = 123;
      const userAuthData = { permissions: { featureX: ['view'] }, level: SecurityLevel.USER };
      it('should fetch authorisations for a specific user', async () => {
        mockApiGet.mockResolvedValueOnce({ data: { data: userAuthData } });
        const result = await authorisationsStore.getUserAuthorisations(userId);
        expect(mockApiGet).toHaveBeenCalledWith(
          expect.stringContaining(`/api/v1/authorization/users/${userId}?_t=`)
        );
        expect(result).toEqual(userAuthData);
      });

      it('should return null on 403 or 404 error', async () => {
        mockApiGet.mockRejectedValueOnce({ response: { status: 403 } });
        expect(await authorisationsStore.getUserAuthorisations(userId)).toBeNull();
        mockApiGet.mockRejectedValueOnce({ response: { status: 404 } });
        expect(await authorisationsStore.getUserAuthorisations(userId)).toBeNull();
      });
    });

    describe('updateUserAuthorization', () => {
      const userId = 123;
      const payload = { level: SecurityLevel.ADMIN, permissions: { featureY: ['all'] } };
      it('should call API to update user authorization', async () => {
        mockApiPut.mockResolvedValueOnce({ data: {} });
        await authorisationsStore.updateUserAuthorization(userId, payload);
        expect(mockApiPut).toHaveBeenCalledWith(`/api/v1/authorization/users/${userId}`, { data: payload });
      });

      it('should throw error if no userId is provided', async () => {
        await expect(authorisationsStore.updateUserAuthorization(0, payload)).rejects.toThrow(
          'User ID must be provided.'
        );
      });

      it('should return null on 403 error', async () => {
        mockApiPut.mockRejectedValueOnce({ response: { status: 403 } });
        const result = await authorisationsStore.updateUserAuthorization(userId, payload);
        expect(result).toBeNull();
      });
    });

    describe('deleteUserAuthorizations', () => {
      const userId = 123;
      it('should call API to delete user specific authorizations', async () => {
        mockApiDelete.mockResolvedValueOnce({});
        await authorisationsStore.deleteUserAuthorizations(userId);
        expect(mockApiDelete).toHaveBeenCalledWith(`/api/v1/authorization/users/${userId}`);
      });

      it('should throw error if no userId is provided', async () => {
        await expect(authorisationsStore.deleteUserAuthorizations(0)).rejects.toThrow(
          'User ID must be provided.'
        );
      });

      it('should return null on 403 error', async () => {
        mockApiDelete.mockRejectedValueOnce({ response: { status: 403 } });
        const result = await authorisationsStore.deleteUserAuthorizations(userId);
        expect(result).toBeNull();
      });
    });

    describe('createTemporaryAuthorisationForUser', () => {
      const userId = 123;
      const tempAuthData = { token: 'temp-token', expiresAt: '2025-12-31T23:59:59Z' };
      it('should call API to create temporary authorisation', async () => {
        mockApiPost.mockResolvedValueOnce({ data: { data: tempAuthData } });
        const result = await authorisationsStore.createTemporaryAuthorisationForUser(userId);
        expect(mockApiPost).toHaveBeenCalledWith(`/api/v1/authorization/users/${userId}/temporary`);
        expect(result).toEqual(tempAuthData);
      });
      it('should return null on 403 error', async () => {
        mockApiPost.mockRejectedValueOnce({ response: { status: 403 } });
        const result = await authorisationsStore.createTemporaryAuthorisationForUser(userId);
        expect(result).toBeNull();
      });
    });
  });
});
