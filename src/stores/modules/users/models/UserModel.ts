import dayjs from 'dayjs';
import { deepCopy } from '@/libs/utils/Object';
import { isValidEmail } from '@/libs/utils/String';

const sortById = (a: UserModel, b: UserModel): number => {
  if (a.id === null || b.id === null) return 0;
  return Number(a.id) - Number(b.id);
};

export enum PasswordStatus {
  ACTIVE = 'ACTIVE',
  VALIDATING = 'VALIDATING',
  EXPIRED = 'EXPIRED',
}

export interface IUser {
  id: number;
  uid: string | null;
  email: string;
  name: string | null;
  surname: string | null;
  level: number;
  internalLevel: number;
  internal: boolean;
  color: string | null;
  passwordStatus: PasswordStatus;
  createdAt: string | null;
  updatedAt: string | null;
  passwordUpdatedAt: string | null;
  preferences: Record<string, any> | null;
  permissionsExpireAt: string | null;
  authorisationOverrides: string | null;
  token?: string;
  security?: string;

}


export default class UserModel {
  id: number;
  uid: string | null;
  email: string;
  name: string | null;
  surname: string | null;
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
  authorisationOverrides: string | null;

  // Jetons d'authentification frontend uniquement
  token?: string;
  security?: string;


  /**
   * Construct a UserModel from partial backend data (dates as string or Date)
   */
  constructor(data?: Partial<UserModel>) {
    this.id = data?.id ?? 0;
    this.uid = data?.uid ?? null;
    this.email = data?.email ?? '';
    this.name = data?.name ?? null;
    this.surname = data?.surname ?? null;
    this.level = data?.level ?? 0;
    this.internalLevel = data?.internalLevel ?? 0;
    this.internal = data?.internal ?? false;
    this.color = data?.color ?? null;
    this.passwordStatus = data?.passwordStatus ?? PasswordStatus.ACTIVE;
    this.createdAt = data?.createdAt ? dayjs(data.createdAt).toDate() : null;
    this.updatedAt = data?.updatedAt ? dayjs(data.updatedAt).toDate() : null;
    this.passwordUpdatedAt = data?.passwordUpdatedAt ? dayjs(data.passwordUpdatedAt).toDate() : null;
    this.preferences = data?.preferences ?? null;
    this.permissionsExpireAt = data?.permissionsExpireAt ? dayjs(data.permissionsExpireAt).toDate() : null;
    this.authorisationOverrides = data?.authorisationOverrides ?? null;
    this.token = data?.token;
    this.security = data?.security;
  }

  static sort(a: UserModel, b: UserModel): number {
    return sortById(a, b);
  }

  /**
   * Transforme un objet brut issu de l'API en instance de UserModel.
   * Ici, on ne traite plus de partitions.
   */
  /**
   * Transform API object into UserModel instance (dates as string or Date)
   */
  static fromAPI(user: Partial<IUser>): UserModel {
    return new UserModel({
      ...user,
      createdAt: user.createdAt ? dayjs(user.createdAt).toDate() : null,
      updatedAt: user.updatedAt ? dayjs(user.updatedAt).toDate() : null,
      passwordUpdatedAt: user.passwordUpdatedAt ? dayjs(user.passwordUpdatedAt).toDate() : null,
      permissionsExpireAt: user.permissionsExpireAt ? dayjs(user.permissionsExpireAt).toDate() : null,
      authorisationOverrides: user.authorisationOverrides ?? null,
    });
  }

  /**
   * Returns the full name (handles null/undefined)
   */
  get fullName(): string {
    return [this.name, this.surname].filter(Boolean).join(' ').trim();
  }

  /**
   * Prépare l'objet pour l'envoi vers l'API, en supprimant certains champs.
   */
  /**
   * Prepare object for API (convert dates to ISO string, remove frontend-only fields)
   */
  toAPI(): Partial<IUser> {
    return {
      id: this.id,
      uid: this.uid,
      email: this.email,
      name: this.name,
      surname: this.surname,
      level: this.level,
      internalLevel: this.internalLevel,
      internal: this.internal,
      color: this.color,
      passwordStatus: this.passwordStatus,
      createdAt: this.createdAt ? this.createdAt.toISOString() : null,
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      passwordUpdatedAt: this.passwordUpdatedAt ? this.passwordUpdatedAt.toISOString() : null,
      preferences: this.preferences,
      permissionsExpireAt: this.permissionsExpireAt ? this.permissionsExpireAt.toISOString() : null,
      authorisationOverrides: this.authorisationOverrides ?? null,
    };
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
    if (!isValidEmail(this.email)) return false;
    if (!this.name || !this.name.trim()) return false;
    if (!this.level || this.level < 0) return false;
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
  }

  /**
   * Returns true if the user's permissions have expired
   */
  hasExpired(): boolean {
    if (!this.permissionsExpireAt) return false;
    return dayjs().isAfter(dayjs(this.permissionsExpireAt));
  }
}
