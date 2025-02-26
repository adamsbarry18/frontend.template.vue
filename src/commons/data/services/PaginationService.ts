export interface PaginationServiceSettings {
  defaultPage: number;
  size: number;
}

export interface PaginationContext {
  page: number;
  size: number;
}

const PAGINATION_DEFAULTS: PaginationServiceSettings = {
  defaultPage: 1,
  size: 12,
};

export default class PaginationService {
  private readonly defaultPage: number;
  private pageNumber: number;
  private _itemsTotal: number;
  private readonly size: number;

  constructor(settings: Partial<PaginationServiceSettings> = {}) {
    const mergedSettings: PaginationServiceSettings = {
      ...PAGINATION_DEFAULTS,
      ...settings,
    };

    this.defaultPage = mergedSettings.defaultPage;
    this.pageNumber = mergedSettings.defaultPage;
    this._itemsTotal = 0;
    this.size = mergedSettings.size;
  }

  get getDefaultPage(): number {
    return this.defaultPage;
  }

  get itemsTotal(): number {
    return this._itemsTotal;
  }

  set itemsTotal(value: number) {
    this._itemsTotal = value;
  }

  get getPageNumber(): number {
    return this.pageNumber;
  }

  get getPageTotal(): number {
    return Math.ceil(this.itemsTotal / this.size);
  }

  get getSize(): number {
    return this.size;
  }

  get context(): PaginationContext {
    return {
      page: this.pageNumber,
      size: this.size,
    };
  }

  static mergeContext(
    target: Partial<PaginationContext>,
    source: Partial<PaginationContext>
  ): PaginationContext {
    return {
      page: source.page || target.page || 1,
      size: source.size || target.size || 12,
    };
  }

  changePage(pageNumber: number): void {
    this.pageNumber = pageNumber;
  }

  paginateData<T>(data: T[]): T[] {
    const startIndex = (this.pageNumber - 1) * this.size;
    const endIndex = startIndex + this.size;

    return data.slice(startIndex, endIndex);
  }
}
