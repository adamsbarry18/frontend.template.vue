import dayjs from 'dayjs';
import { BaseInterceptor } from './BaseInterceptor';
import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const DEFAULT_PAGE_SIZE = 50;

export type FilterType =
  | 'contains'
  | 'bool'
  | 'in'
  | 'enum'
  | 'numberrange'
  | 'daterange'
  | string;

export interface Filter {
  type: FilterType;
  value: any;
}

export interface PaginationContext {
  page?: number;
  size?: number;
  sort?: { prop: string; order: 'ascending' | 'descending' };
  q?: string;
  filters?: Record<string, Filter>;
}

export interface PaginationConfig extends InternalAxiosRequestConfig {
  pagination?: PaginationContext;
}

/**
 * Retourne la chaîne de filtre à partir d'un objet filtre pour un champ donné.
 * @param filter Objet de filtre
 * @param field Nom du champ
 * @returns Chaîne de filtre ou tableau de chaînes pour 'numberrange' ou 'daterange'
 */
function getFilterString(
  filter: Filter,
  field: string
): string | Array<string | null> | null {
  switch (filter.type) {
    case 'contains':
      return `${field}:${String(filter.value).replaceAll(':', '\\:')}:contains`;
    case 'bool':
      return `${field}:${filter.value}:eq`;
    case 'in':
    case 'enum':
      return Array.isArray(filter.value)
        ? `${field}:${filter.value.join('|')}:in`
        : null;
    case 'numberrange':
      return Array.isArray(filter.value)
        ? filter.value.map((v, index) => {
            if (v === null || typeof v === 'undefined') {
              return null;
            }
            const operator = index === 0 ? 'gte' : 'lte';
            return `${field}:${v}:${operator}`;
          })
        : null;
    case 'daterange':
      return Array.isArray(filter.value)
        ? filter.value.map((v, index) => {
            if (v === null || typeof v === 'undefined') {
              return null;
            }
            const datestring = dayjs(v)
              .toDate()
              .toISOString()
              .replaceAll(':', '\\:');
            const operator = index === 0 ? 'gte' : 'lte';
            return `${field}:${datestring}:${operator}`;
          })
        : null;
    default:
      return `${field}:${filter.value}:eq`;
  }
}

/**
 * Ajoute les paramètres de pagination à la requête.
 * @param query Configuration de la requête
 * @param ctx Contexte de pagination
 */
export function paginateQuery(
  query: Record<string, any> = {},
  ctx: PaginationContext = {}
): void {
  query.params = query.params || {};
  if (ctx.page || ctx.size) {
    query.params.page = ctx.page || 1;
    query.params.size = ctx.size || DEFAULT_PAGE_SIZE;
  }
  if (ctx.sort) {
    query.params.sort = `${ctx.sort.prop}.${ctx.sort.order === 'descending' ? 'desc' : 'asc'}`;
  }
  if (ctx.q) {
    query.params.q = ctx.q;
  }
  if (ctx.filters && Object.keys(ctx.filters).length) {
    query.params.filters = Object.keys(ctx.filters)
      .map((field) => getFilterString(ctx.filters![field], field))
      .flat()
      .filter((filter): filter is string => !!filter)
      .join(',');
  }
}

export class PaginationInterceptor extends BaseInterceptor {
  public override getType(): string {
    return 'PaginationInterceptor';
  }

  public override requestInterceptor() {
    return {
      request: (config: PaginationConfig): PaginationConfig =>
        this.setPagination(config),
      error: (error: any) => Promise.reject(error),
    };
  }

  public override responseInterceptor() {
    return {
      response: (response: AxiosResponse): AxiosResponse => response,
      error: async (error: any) => {
        throw error;
      },
    };
  }

  private setPagination(config: PaginationConfig): PaginationConfig {
    if (config.pagination) {
      paginateQuery(config, config.pagination);
    }
    return config;
  }
}
