import dayjs from 'dayjs';
import { deepCopy } from '@/libs/utils/Object';
import { isValidEmail } from '@/libs/utils/String';

const sortById = (a: UserModel, b: UserModel): number => {
  if (a.id === null || b.id === null) return 0;
  return Number(a.id) - Number(b.id);
};

export interface IUser {
  id: number | string | null;
  email: string;
  language: string;
  level: number | null;
  name: string;
  surname: string;
  token: string | null;
  security: any;
  internal: boolean;
  created_time: Date | null;
  passwordStatus: string;
  password_time: Date | null;
  updated_time: Date | null;
  color: string | null;
  preferences: Record<string, any> | null;
}

export default class UserModel implements IUser {
  id: number | string | null;
  email: string;
  language: string;
  level: number | null;
  name: string;
  surname: string;
  token: string | null;
  security: any;
  internal: boolean;
  created_time: Date | null;
  passwordStatus: string;
  password_time: Date | null;
  updated_time: Date | null;
  color: string | null;
  preferences: Record<string, any> | null;

  constructor(data?: Partial<IUser>) {
    this.id = data?.id ?? null;
    this.email = data?.email ?? '';
    this.language = data?.language ?? 'en';
    this.level = data?.level ?? null;
    this.name = data?.name ?? '';
    this.surname = data?.surname ?? '';
    this.token = data?.token ?? null;
    this.security = data?.security ?? null;
    this.internal = data?.internal ?? false;
    this.created_time = data?.created_time ?? null;
    this.passwordStatus = data?.passwordStatus ?? '';
    this.password_time = data?.password_time ?? null;
    this.updated_time = data?.updated_time ?? null;
    this.color = data?.color ?? null;
    this.preferences = data?.preferences ?? null;
  }

  static sort(a: UserModel, b: UserModel): number {
    return sortById(a, b);
  }

  /**
   * Transforme un objet brut issu de l'API en instance de UserModel.
   * Ici, on ne traite plus de partitions.
   */
  static fromAPI(user: any): UserModel {
    const res = { ...user };
    // Conversion des dates
    if (res.created_time) res.created_time = dayjs(res.created_time).toDate();
    if (res.updated_time) res.updated_time = dayjs(res.updated_time).toDate();
    if (res.password_time)
      res.password_time = dayjs(res.password_time).toDate();
    return new UserModel(res);
  }

  get fullName(): string {
    return `${this.name} ${this.surname}`.trim();
  }

  /**
   * Prépare l'objet pour l'envoi vers l'API, en supprimant certains champs.
   */
  toAPI(): Partial<IUser> {
    const res: any = { ...this };
    if (res.id === null) {
      delete res.id;
    }
    const clearFields = [
      'created_time',
      'updated_time',
      'passwordStatus',
      'password_time',
      'token',
      'security',
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

  isValid(): boolean {
    if (!isValidEmail(this.email)) return false;
    const requiredFields = ['language', 'name', 'surname'];
    for (const field of requiredFields) {
      if (
        !this[field] ||
        (typeof this[field] === 'string' && this[field].trim() === '')
      ) {
        return false;
      }
    }
    return true;
  }

  reset(): void {
    this.id = null;
    this.name = '';
    this.surname = '';
    this.language = 'en';
    this.internal = false;
    this.level = 2;
  }
}
