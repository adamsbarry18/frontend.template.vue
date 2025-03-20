import i18n from '@/i18n';

interface SearchFilter {
  type: string;
  value: any;
}

interface SearchFilters {
  [key: string]: SearchFilter;
}

interface SearchServiceSettings {
  input?: string;
  filterConfig?: object;
  filterPanelActive?: boolean;
  filters?: SearchFilters;
  placeholder?: string;
}

interface SearchContext {
  q?: string;
  filters: SearchFilters;
}

const searchDefaults: SearchServiceSettings = {
  input: '',
  filterConfig: {},
  filterPanelActive: false,
  filters: {},
  placeholder: i18n.global.t('commons.searchbar.default-placeholder'),
};

/**
 * Search service is responsible of managing the query input search and the filter panel
 */
export default class SearchService {
  private _input: string;
  private _filterConfig: object;
  private _filterPanelActive: boolean;
  private _filters: SearchFilters;
  private _placeholder: string;

  /**
   * Creates an instance of search service that should be passed as a list service
   *
   * @param settings - configuration of the search service
   */
  constructor(settings: SearchServiceSettings = searchDefaults) {
    const mSettings = Object.assign({}, searchDefaults, settings);

    this._input = mSettings.input || '';
    this._filterConfig = mSettings.filterConfig || {};
    this._filterPanelActive = mSettings.filterPanelActive || false;
    this._filters = mSettings.filters || {};
    this._placeholder = mSettings.placeholder || '';
  }

  get placeholder(): string {
    return this._placeholder;
  }

  get filterPanelActive(): boolean {
    return this._filterPanelActive;
  }

  set filterPanelActive(active: boolean) {
    this._filterPanelActive = active;
  }

  get filters(): SearchFilters {
    return this._filters;
  }

  set filters(filters: SearchFilters) {
    this._filters = filters;
  }

  get filterConfig(): object {
    return this._filterConfig;
  }

  get input(): string {
    return this._input;
  }

  set input(input: string) {
    this._input = input;
  }

  get context(): SearchContext {
    return SearchService.cleanContext({ q: this.input, filters: this.filters });
  }

  get isFiltered(): boolean {
    return !!this.input || Object.keys(this.filters).length > 0;
  }

  /**
   * removes empty filters or empty query
   *
   * @param contextToClean - context to clean
   */
  static cleanContext(contextToClean: SearchContext): SearchContext {
    const ctx: SearchContext = { filters: {} };

    if (contextToClean.q) ctx.q = contextToClean.q;
    if (Object.keys(contextToClean.filters || {}).length > 0) ctx.filters = {};

    for (const [filterProp, filter] of Object.entries(
      contextToClean.filters || {}
    )) {
      if (!filter.value) continue;
      if (
        filter.type === 'enum' &&
        Array.isArray(filter.value) &&
        filter.value.length < 1
      )
        continue;

      ctx.filters[filterProp] = filter;
    }

    return ctx;
  }

  /**
   * @param target - context that will be merged over
   * @param source - context that will be merged into target
   */
  static mergeContext(
    target: SearchContext,
    source: SearchContext
  ): SearchContext {
    return this.cleanContext({
      q: source.q || target.q,
      filters: {
        ...(target.filters || {}),
        ...(source.filters || {}),
      },
    });
  }
}
