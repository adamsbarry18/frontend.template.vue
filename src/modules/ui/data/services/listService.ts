import { deepCopy } from '@/libs/utils/Object';
import SearchService from './searchService';
import PaginationService from './PaginationService';
import SortService from './sortService';
import EntityService from './entityService';
import UrlFiltersService from './urlFiterService';

export interface ListServiceSettings {
  data?: any[];
  search?: SearchService | null;
  pagination?: PaginationService | null;
  entity?: EntityService | null;
  urlFilters?: UrlFiltersService | null;
  sort?: SortService | null;
  retrieveDataPromise?:
    | ((context: any) => Promise<{ itemsTotal: number; data: any[] }>)
    | null;
  showCounts?: boolean;
  autoload?: boolean;
}

interface DataResponse {
  itemsTotal: number;
  data: any[];
}

const listDefaults: ListServiceSettings = {
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

export default class ListService {
  private _data: any[];
  private _search: SearchService | null;
  private _pagination: PaginationService | null;
  private _entity: EntityService | null;
  private _urlFilters: UrlFiltersService | null;
  private _sort: SortService | null;
  private _retrieveDataPromise:
    | ((context: any) => Promise<DataResponse>)
    | null;
  private _showCounts: boolean;
  private _itemsTotal: number;
  private _autoload: boolean;
  private _retrieveDataCallback: ((data: any[]) => void) | null = null;

  /**
   * Creates an instance of list service
   *
   * @param settings - configuration of the list service
   */
  constructor(settings: ListServiceSettings = listDefaults) {
    const mSettings: ListServiceSettings = Object.assign(
      deepCopy(listDefaults),
      settings
    );

    this._data = mSettings.data || [];
    this._search = mSettings.search || null;
    this._pagination = mSettings.pagination || null;
    this._entity = mSettings.entity || null;
    this._urlFilters = mSettings.urlFilters || null;
    this._sort = mSettings.sort || null;
    this._retrieveDataPromise = mSettings.retrieveDataPromise || null;
    this._showCounts = mSettings.showCounts ?? true;
    this._itemsTotal = mSettings.data?.length || 0;
    this._autoload = mSettings.autoload ?? true;
  }

  get data(): any[] {
    return this.paginateData(this.filterData(this._data));
  }

  get pagination(): PaginationService | null {
    return this._pagination;
  }

  get search(): SearchService | null {
    return this._search;
  }

  get showCounts(): boolean {
    return this._showCounts;
  }

  get entity(): EntityService | null {
    return this._entity;
  }

  get urlFilters(): UrlFiltersService | null {
    return this._urlFilters;
  }

  get sort(): SortService | null {
    return this._sort;
  }

  get itemsTotal(): number {
    return this._itemsTotal;
  }

  get autoload(): boolean {
    return this._autoload;
  }

  filterData(data: any[]): any[] {
    return data;
  }

  paginateData(data: any[]): any[] {
    return this._pagination?.paginateData(data) || data;
  }

  onRetrieveData(callback: (data: any[]) => void): void {
    this._retrieveDataCallback = callback;
  }

  get context(): any {
    return {
      ...this._pagination?.context,
      ...this._search?.context,
      ...this._sort?.context,
    };
  }

  /**
   * @returns The data array returned by the callback
   */
  async retrieveData(): Promise<any[]> {
    if (!this._retrieveDataPromise) {
      if (this._retrieveDataCallback) this._retrieveDataCallback(this.data);

      return this.data;
    }

    const { itemsTotal, data } = await this._retrieveDataPromise(this.context);

    if (this._pagination) this._pagination.itemsTotal = itemsTotal;
    this._itemsTotal = itemsTotal;

    if (this._retrieveDataCallback) this._retrieveDataCallback(data);

    return data;
  }

  async onFilterChange(): Promise<any[]> {
    this._pagination?.changePage(1);
    return await this.retrieveData();
  }

  static mergeContexts(target: any, source: any): any {
    return {
      ...PaginationService.mergeContext(target, source),
      ...SearchService.mergeContext(target, source),
      ...SortService.mergeContext(target, source),
    };
  }
}
