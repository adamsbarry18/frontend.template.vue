import { deepCopy } from '@/libs/utils/Object';
import SearchService, { SearchContext } from './searchService';
import PaginationService, { PaginationContext } from './PaginationService';
import SortService, { SortContext } from './sortService';
import EntityService from './entityService';
import UrlFiltersService from './urlFiterService';

export interface RetrieveDataResult<T> {
  itemsTotal: number;
  data: T[];
}

export interface ListContext
  extends SearchContext,
    PaginationContext,
    SortContext {}

export interface ListServiceSettings<T> {
  data: T[];
  search: SearchService | null;
  pagination: PaginationService | null;
  entity: EntityService | null;
  urlFilters: UrlFiltersService | null;
  sort: SortService | null;
  retrieveDataPromise:
    | ((context: ListContext) => Promise<RetrieveDataResult<T>>)
    | null;
  showCounts: boolean;
  autoload: boolean;
}

const LIST_DEFAULTS: ListServiceSettings<any> = {
  data: [],
  search: null,
  pagination: null,
  entity: null,
  urlFilters: null,
  sort: null,
  retrieveDataPromise: null,
  showCounts: true,
  autoload: true,
};

export default class ListService<T> {
  private readonly data: T[];
  private readonly search: SearchService | null;
  private readonly pagination: PaginationService | null;
  private readonly entity: EntityService | null;
  private readonly urlFilters: UrlFiltersService | null;
  private readonly sort: SortService | null;
  private readonly retrieveDataPromise:
    | ((context: ListContext) => Promise<RetrieveDataResult<T>>)
    | null;
  private readonly showCounts: boolean;
  private itemsTotal: number;
  private readonly autoload: boolean;
  private retrieveDataCallback: ((data: T[]) => void) | null = null;

  constructor(settings: Partial<ListServiceSettings<T>> = {}) {
    const mergedSettings: ListServiceSettings<T> = {
      ...deepCopy(LIST_DEFAULTS),
      ...settings,
    } as ListServiceSettings<T>;

    this.data = mergedSettings.data;
    this.search = mergedSettings.search;
    this.pagination = mergedSettings.pagination;
    this.entity = mergedSettings.entity;
    this.urlFilters = mergedSettings.urlFilters;
    this.sort = mergedSettings.sort;
    this.retrieveDataPromise = mergedSettings.retrieveDataPromise;
    this.showCounts = mergedSettings.showCounts;
    this.itemsTotal = mergedSettings.data.length;
    this.autoload = mergedSettings.autoload;
  }

  get getData(): T[] {
    return this.paginateData(this.filterData(this.data));
  }

  get getPagination(): PaginationService | null {
    return this.pagination;
  }

  get getSearch(): SearchService | null {
    return this.search;
  }

  get getShowCounts(): boolean {
    return this.showCounts;
  }

  get getEntity(): EntityService | null {
    return this.entity;
  }

  get getUrlFilters(): UrlFiltersService | null {
    return this.urlFilters;
  }

  get getSort(): SortService | null {
    return this.sort;
  }

  get getItemsTotal(): number {
    return this.itemsTotal;
  }

  get getAutoload(): boolean {
    return this.autoload;
  }

  filterData(data: T[]): T[] {
    return data;
  }

  paginateData(data: T[]): T[] {
    return this.pagination?.paginateData(data) || data;
  }

  onRetrieveData(callback: (data: T[]) => void): void {
    this.retrieveDataCallback = callback;
  }

  get context(): ListContext {
    return {
      ...this.pagination?.context,
      ...this.search?.context,
      ...this.sort?.context,
    } as ListContext;
  }

  async retrieveData(): Promise<T[]> {
    if (!this.retrieveDataPromise) {
      if (this.retrieveDataCallback) this.retrieveDataCallback(this.getData);
      return this.getData;
    }

    const { itemsTotal, data } = await this.retrieveDataPromise(this.context);

    if (this.pagination) this.pagination.itemsTotal = itemsTotal;
    this.itemsTotal = itemsTotal;

    if (this.retrieveDataCallback) this.retrieveDataCallback(data);

    return data;
  }

  async onFilterChange(): Promise<T[]> {
    this.pagination?.changePage(1);
    return await this.retrieveData();
  }

  static mergeContexts<T extends object, U extends object>(
    target: T,
    source: U
  ): T & U {
    return {
      ...PaginationService.mergeContext(target, source),
      ...SearchService.mergeContext(target, source),
      ...SortService.mergeContext(target, source),
    } as unknown as T & U;
  }
}
