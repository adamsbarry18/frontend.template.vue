import dayjs from 'dayjs';
import { deepCopy } from '@/libs/utils/Object';
import { isValidEmail } from '@/libs/utils/String';

const sortById = (a: UserModel, b: UserModel): number => {
  if (a.id === null || b.id === null) return 0;
  return Number(a.id) - Number(b.id);
};

const INTERNAL_EMAIL_DOMAINS = ['myapp.fr', 'myapp.com'];

export enum PasswordStatus {
  ACTIVE = 'ACTIVE',
  VALIDATING = 'VALIDATING',
  EXPIRED = 'EXPIRED',
}

// Export SecurityLevel enum for use in other stores
export enum SecurityLevel {
  EXTERNAL = 1,
  READER = 2,
  USER = 3,
  INTEGRATOR = 4,
  ADMIN = 5,
  NOBODY = 999,
}

export default class UserModel {
  id: number;
  uid: string | null;
  email: string;
  name: string | null;
  surname: string | null;
  password: string | null;
  level: number;
  internalLevel: number;
  internal: boolean;
  color: string | null;
  passwordStatus: PasswordStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
  passwordUpdatedAt: Date | null;
  preferences: Record<string, any> | null;
  permissionsExpireAt: Date | null;
  permissions: Record<string, any> | null;
  authorisationOverrides: string | null;
  token?: string;

  constructor(data?: Partial<UserModel>) {
    this.id = data?.id ?? 0;
    this.uid = data?.uid ?? null;
    this.email = data?.email ?? '';
    this.name = data?.name ?? null;
    this.surname = data?.surname ?? null;
    this.level = data?.level ?? 0;
    this.internalLevel = data?.internalLevel ?? 0;
    this.internal = data?.internal ?? false;
    this.password = data?.password ?? null;
    this.color = data?.color ?? null;
    this.passwordStatus = data?.passwordStatus ?? PasswordStatus.ACTIVE;
    this.createdAt = data?.createdAt
      ? dayjs(data.createdAt).toDate()
      : new Date();
    this.updatedAt = data?.updatedAt
      ? dayjs(data.updatedAt).toDate()
      : new Date();
    this.passwordUpdatedAt = data?.passwordUpdatedAt
      ? dayjs(data.passwordUpdatedAt).toDate()
      : null;
    this.preferences = data?.preferences ?? null;
    this.permissionsExpireAt = data?.permissionsExpireAt
      ? dayjs(data.permissionsExpireAt).toDate()
      : null;
    this.permissions = data?.permissions ?? null;
    this.authorisationOverrides = data?.authorisationOverrides ?? null;
    this.token = data?.token;
  }

  static sort(a: UserModel, b: UserModel): number {
    return sortById(a, b);
  }

  /**
   * Transform API object into UserModel instance (dates as string or Date)
   */
  static fromAPI(user: Partial<UserModel>): UserModel {
    const modelData = {
      ...user,
      name: user.name ?? null,
      createdAt: user.createdAt ? dayjs(user.createdAt).toDate() : new Date(),
      updatedAt: user.updatedAt ? dayjs(user.updatedAt).toDate() : new Date(),
      passwordUpdatedAt: user.passwordUpdatedAt
        ? dayjs(user.passwordUpdatedAt).toDate()
        : null,
      permissionsExpireAt: user.permissionsExpireAt
        ? dayjs(user.permissionsExpireAt).toDate()
        : null,
      permissions: user.permissions ?? null,
      preferences: user.preferences ?? null,
    };
    delete modelData.password;
    return new UserModel(modelData);
  }

  /**
   * Returns the full name (handles null/undefined)
   */
  get fullName(): string {
    return [this.name, this.surname].filter(Boolean).join(' ').trim();
  }

  /**
   * Prepare object for API (convert dates to ISO string, remove frontend-only fields)
   */
  toAPI() {
    const res = { ...this };
    if (res.id === null) {
      delete res.id;
    }
    const clearFields = [
      'createdAt',
      'updatedAt',
      'passwordStatus',
      'passwordUpdatedAt',
      'token',
      'level',
    ];
    for (const field of clearFields) {
      delete res[field];
    }

    return res;
  }

  clone(): UserModel {
    return new UserModel(deepCopy(this));
  }

  getPreference(key: string): any {
    return this.preferences ? this.preferences[key] : null;
  }

  setPreference(key: string, value: any): void {
    if (!this.preferences) {
      this.preferences = {};
    }
    this.preferences[key] = value;
  }

  /**
   * Validate the user model (basic checks)
   */
  isValid(): boolean {
    if (!isValidEmail(this.email)) {
      return false;
    }
    const stringFields: (keyof this)[] = ['email', 'name'];
    for (const field of stringFields) {
      const value = this[field];
      if (typeof value !== 'string' || !value.trim()) {
        return false;
      }
    }
    if (this.level === undefined || this.level === null || this.level <= 0) {
      return false;
    }

    return true;
  }

  /**
   * Reset user to default values (except id)
   */
  reset(): void {
    this.name = null;
    this.surname = null;
    this.level = 0;
    this.internalLevel = 0;
    this.internal = false;
    this.color = null;
    this.passwordStatus = PasswordStatus.ACTIVE;
    this.createdAt = null;
    this.updatedAt = null;
    this.passwordUpdatedAt = null;
    this.preferences = null;
    this.permissionsExpireAt = null;
    this.authorisationOverrides = null;
  }

  static isEmailInternal(email: string) {
    return INTERNAL_EMAIL_DOMAINS.some((domain) =>
      email.endsWith(`@${domain}`)
    );
  }

  /**
   * Returns true if the user's permissions have expired
   */
  hasExpired(): boolean {
    if (!this.permissionsExpireAt) return false;
    return dayjs().isAfter(dayjs(this.permissionsExpireAt));
  }
}
