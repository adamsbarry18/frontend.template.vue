import dayjs from 'dayjs';

export interface IAuthorisation {
  authorisations: any;
  level: number | null;
  expire: Date | null;
  fkUserId: string | null;
}

export default class AuthorisationModel implements IAuthorisation {
  authorisations: any;
  level: number | null;
  expire: Date | null;
  fkUserId: string | null;

  constructor(data: Partial<IAuthorisation> = {}) {
    this.authorisations = data.authorisations ?? null;
    this.level = data.level ?? null;
    this.expire = data.expire ?? null;
    this.fkUserId = data.fkUserId ?? null;
  }

  hasExpired(): boolean {
    if (this.expire === null) {
      return false;
    }
    return dayjs().isAfter(dayjs(this.expire));
  }
}
