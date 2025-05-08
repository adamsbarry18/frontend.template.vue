interface PaginationServiceSettings {
  defaultPage?: number;
  size?: number;
}

interface PaginationContext {
  page: number;
  size: number;
}

const paginationDefaults: PaginationServiceSettings = {
  defaultPage: 1,
  size: 12,
};

export default class PaginationService {
  private _pageNumber: number = 1;
  private _pageSize: number = 25;
  private _totalItems: number = 0;
  private _totalPages: number = 1;

  constructor(settings: PaginationServiceSettings = paginationDefaults) {
    const mSettings = Object.assign({}, paginationDefaults, settings);

    this._pageNumber = mSettings.defaultPage || 1;
    this._pageSize = mSettings.size || 25;
    this._totalItems = 0;
    this._totalPages = 1;
  }

  get defaultPage(): number {
    return this._pageNumber;
  }

  get itemsTotal(): number {
    return this._totalItems;
  }

  set itemsTotal(itemsTotal: number) {
    this._totalItems = itemsTotal;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }

  get pageTotal(): number {
    return Math.ceil(this.itemsTotal / this.size);
  }

  get size(): number {
    return this._pageSize;
  }

  get context(): PaginationContext {
    return {
      page: this.pageNumber,
      size: this.size,
    };
  }

  static mergeContext(target: PaginationContext, source: PaginationContext): PaginationContext {
    return {
      page: source.page || target.page,
      size: source.size || target.size,
    };
  }

  changePage(pageNumber: number): void {
    this._pageNumber = pageNumber;
  }

  paginateData<T>(data: T[]): T[] {
    const startIndex = (this.pageNumber - 1) * this.size;
    const endIndex = startIndex + this.size;

    return data.slice(startIndex, endIndex);
  }
}
