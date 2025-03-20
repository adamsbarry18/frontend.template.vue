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
  private _defaultPage: number;
  private _pageNumber: number;
  private _itemsTotal: number;
  private _size: number;

  constructor(settings: PaginationServiceSettings = paginationDefaults) {
    const mSettings = Object.assign({}, paginationDefaults, settings);

    this._defaultPage = mSettings.defaultPage!;
    this.changePage(mSettings.defaultPage!);
    this._itemsTotal = 0;
    this._size = mSettings.size!;
  }

  get defaultPage(): number {
    return this._defaultPage;
  }

  get itemsTotal(): number {
    return this._itemsTotal;
  }

  set itemsTotal(itemsTotal: number) {
    this._itemsTotal = itemsTotal;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }

  get pageTotal(): number {
    return Math.ceil(this.itemsTotal / this.size);
  }

  get size(): number {
    return this._size;
  }

  get context(): PaginationContext {
    return {
      page: this.pageNumber,
      size: this.size,
    };
  }

  static mergeContext(
    target: PaginationContext,
    source: PaginationContext
  ): PaginationContext {
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
