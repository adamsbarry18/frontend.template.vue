import { describe, it, expect } from 'vitest';
import UserModel, { PasswordStatus, SecurityLevel } from '../UserModel';

describe('UserModel', () => {
  const baseData = {
    id: 1,
    uid: 'test-uid-123',
    email: 'name@example.com',
    name: 'TestName',
    surname: 'TestSurname',
    level: SecurityLevel.USER,
    internal: false,
    passwordStatus: PasswordStatus.ACTIVE,
    createdAt: new Date('2024-03-12T10:00:00Z'),
    updatedAt: new Date('2024-03-12T11:00:00Z'),
    passwordUpdatedAt: new Date('2024-03-12T09:00:00Z'),
    preferences: { language: 'en', theme: 'dark' },
    token: 'test-token-123',
    permissionsExpireAt: new Date('2025-01-01T00:00:00Z'),
    permissions: { featureA: true },
    authorisationOverrides: 'override_string',
    color: '#123456',
    internalLevel: 2,
  };

  describe('Constructor and Basic Properties', () => {
    it('should create an instance with provided data', () => {
      const user = new UserModel(baseData);
      expect(user).toBeInstanceOf(UserModel);
      expect(user.id).toBe(baseData.id);
      expect(user.uid).toBe(baseData.uid);
      expect(user.email).toBe(baseData.email);
      expect(user.name).toBe(baseData.name);
      expect(user.surname).toBe(baseData.surname);
      expect(user.level).toBe(baseData.level);
      expect(user.internal).toBe(baseData.internal);
      expect(user.passwordStatus).toBe(baseData.passwordStatus);
      expect(user.preferences).toEqual(baseData.preferences);
      expect(user.token).toBe(baseData.token);
      expect(user.color).toBe(baseData.color);
      expect(user.internalLevel).toBe(baseData.internalLevel);
      expect(user.permissions).toEqual(baseData.permissions);
      expect(user.authorisationOverrides).toBe(baseData.authorisationOverrides);

      // Dates are converted to Date objects
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.createdAt?.toISOString()).toBe(baseData.createdAt.toISOString());
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.updatedAt?.toISOString()).toBe(baseData.updatedAt.toISOString());
      expect(user.passwordUpdatedAt).toBeInstanceOf(Date);
      expect(user.passwordUpdatedAt?.toISOString()).toBe(baseData.passwordUpdatedAt.toISOString());
      expect(user.permissionsExpireAt).toBeInstanceOf(Date);
      expect(user.permissionsExpireAt?.toISOString()).toBe(baseData.permissionsExpireAt.toISOString());
    });

    it('should use default values for missing optional data', () => {
      const minimalData = { id: 2, email: 'minimal@example.com' };
      const user = new UserModel(minimalData);
      expect(user.id).toBe(2);
      expect(user.email).toBe('minimal@example.com');
      expect(user.name).toBeNull();
      expect(user.surname).toBeNull();
      expect(user.level).toBe(0);
      expect(user.internal).toBe(false);
      expect(user.passwordStatus).toBe(PasswordStatus.ACTIVE);
      expect(user.preferences).toBeNull();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should correctly calculate fullName', () => {
      const user = new UserModel({ name: 'John', surname: 'Doe' });
      expect(user.fullName).toBe('John Doe');
      const userNoSurname = new UserModel({ name: 'Cher' });
      expect(userNoSurname.fullName).toBe('Cher');
      const userNoName = new UserModel({ surname: 'Madonna' });
      expect(userNoName.fullName).toBe('Madonna');
      const userNoNameOrSurname = new UserModel({});
      expect(userNoNameOrSurname.fullName).toBe('');
    });

    it('handles date strings in constructor correctly (simulating old test logic)', () => {
      const localDateString = '2024-03-12 10:03:24';
      const user = new UserModel({ createdAt: localDateString, updatedAt: localDateString } as any);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(() => user.createdAt?.toISOString()).not.toThrow();
    });
  });

  describe('UserModel.fromAPI()', () => {
    it('should create a UserModel instance from API data', () => {
      const apiData = {
        id: 3,
        email: 'api@example.com',
        name: 'ApiUser',
        level: SecurityLevel.ADMIN,
        createdAt: new Date('2024-03-13T12:00:00Z'),
        updatedAt: new Date('2024-03-13T13:00:00Z'),
        password: 'shouldberemoved',
        preferences: { theme: 'light' },
      };
      const user = UserModel.fromAPI(apiData as any);
      expect(user).toBeInstanceOf(UserModel);
      expect(user.id).toBe(apiData.id);
      expect(user.email).toBe(apiData.email);
      expect(user.name).toBe(apiData.name);
      expect(user.level).toBe(apiData.level);
      expect(user.createdAt?.toISOString()).toBe(apiData.createdAt.toISOString());
      expect(user.updatedAt?.toISOString()).toBe(apiData.updatedAt.toISOString());
      expect(user.password).toBeNull(); // fromAPI should set password to null or undefined
      expect(user.preferences).toEqual(apiData.preferences);
    });

    it('should handle missing optional fields in fromAPI', () => {
      const minimalApiData = { id: 4, email: 'minimalapi@example.com' };
      const user = UserModel.fromAPI(minimalApiData);
      expect(user.name).toBeNull();
      expect(user.preferences).toBeNull();
      expect(user.createdAt).toBeInstanceOf(Date); // Defaults to new Date()
    });
  });

  describe('toAPI()', () => {
    it('should return an object suitable for API submission', () => {
      const user = new UserModel(baseData);
      const apiObject = user.toAPI();

      expect(apiObject.id).toBe(baseData.id); // id is kept if not null
      expect(apiObject.email).toBe(baseData.email);
      // Fields that should be removed
      expect(apiObject).not.toHaveProperty('createdAt');
      expect(apiObject).not.toHaveProperty('updatedAt');
      expect(apiObject).not.toHaveProperty('passwordStatus');
      expect(apiObject).not.toHaveProperty('passwordUpdatedAt');
      expect(apiObject).not.toHaveProperty('token');
      // 'level' is also removed by the current toAPI implementation
      expect(apiObject).not.toHaveProperty('level');

      // Check other properties are present
      expect(apiObject.name).toBe(baseData.name);
      expect(apiObject.preferences).toEqual(baseData.preferences);
    });

    it('should remove id if it is null (though constructor defaults to 0)', () => {
      const userWithNullId = new UserModel({ ...baseData, id: null as any });
      userWithNullId.id = null as any;
      const apiObject = userWithNullId.toAPI();
      expect(apiObject).not.toHaveProperty('id');
    });
  });

  describe('clone()', () => {
    it('should create a deep copy of the user model', () => {
      const originalUser = new UserModel(baseData);
      const clonedUser = originalUser.clone();

      expect(clonedUser).toBeInstanceOf(UserModel);
      expect(clonedUser).not.toBe(originalUser);
      expect(clonedUser).toEqual(originalUser);

      // Test deep copy for preferences
      expect(clonedUser.preferences).toEqual(originalUser.preferences);
      expect(clonedUser.preferences).not.toBe(originalUser.preferences);
      if (clonedUser.preferences) {
        clonedUser.preferences.language = 'fr';
      }
      expect(originalUser.preferences?.language).toBe('en');
      expect(clonedUser.preferences?.language).toBe('fr');
    });
  });

  describe('isValid()', () => {
    it('should return true for a valid user', () => {
      const user = new UserModel({
        email: 'valid@example.com',
        name: 'Valid Name',
        level: SecurityLevel.USER,
      });
      expect(user.isValid()).toBe(true);
    });

    it('should return false for invalid email', () => {
      const user = new UserModel({ email: 'invalid-email', name: 'Test', level: 1 });
      expect(user.isValid()).toBe(false);
    });

    it('should return false for empty name', () => {
      const user = new UserModel({ email: 'test@example.com', name: '  ', level: 1 });
      expect(user.isValid()).toBe(false);
    });
    it('should return false for null name', () => {
      const user = new UserModel({ email: 'test@example.com', name: null, level: 1 });
      expect(user.isValid()).toBe(false);
    });

    it('should return false for invalid level (0 or less)', () => {
      const user = new UserModel({ email: 'test@example.com', name: 'Test', level: 0 });
      expect(user.isValid()).toBe(false);
      user.level = -1;
      expect(user.isValid()).toBe(false);
    });
  });

  describe('reset()', () => {
    it('should reset user properties to default values', () => {
      const user = new UserModel(baseData);
      const originalId = user.id;
      const originalEmail = user.email;

      user.reset();

      expect(user.id).toBe(originalId);
      expect(user.email).toBe(originalEmail);
      expect(user.name).toBeNull();
      expect(user.surname).toBeNull();
      expect(user.level).toBe(0);
      expect(user.internalLevel).toBe(0);
      expect(user.internal).toBe(false);
      expect(user.color).toBeNull();
      expect(user.passwordStatus).toBe(PasswordStatus.ACTIVE);
      expect(user.createdAt).toBeNull();
      expect(user.updatedAt).toBeNull();
      expect(user.passwordUpdatedAt).toBeNull();
      expect(user.preferences).toBeNull();
      expect(user.permissionsExpireAt).toBeNull();
      expect(user.authorisationOverrides).toBeNull();
    });
  });

  describe('UserModel.isEmailInternal()', () => {
    it('should return true for internal email domains', () => {
      expect(UserModel.isEmailInternal('user@myapp.fr')).toBe(true);
      expect(UserModel.isEmailInternal('user@myapp.com')).toBe(true);
    });

    it('should return false for external email domains', () => {
      expect(UserModel.isEmailInternal('user@otherdomain.com')).toBe(false);
      expect(UserModel.isEmailInternal('user@gmail.com')).toBe(false);
    });
  });

  describe('hasExpired()', () => {
    it('should return false if permissionsExpireAt is null', () => {
      const user = new UserModel({ permissionsExpireAt: null });
      expect(user.hasExpired()).toBe(false);
    });

    it('should return false if permissionsExpireAt is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const user = new UserModel({ permissionsExpireAt: futureDate });
      expect(user.hasExpired()).toBe(false);
    });

    it('should return true if permissionsExpireAt is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const user = new UserModel({ permissionsExpireAt: pastDate });
      expect(user.hasExpired()).toBe(true);
    });
  });
});
