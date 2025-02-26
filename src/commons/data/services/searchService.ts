import i18n from '@/i18n';

export interface FilterConfig {
  [key: string]: any;
}

export interface Filter {
  type?: string;
  value?: any;
  [key: string]: any;
}

export interface Filters {
  [key: string]: Filter;
}

export interface SearchServiceSettings {
  input: string;
  filterConfig: FilterConfig;
  filterPanelActive: boolean;
  filters: Filters;
  placeholder: string;
}

export interface SearchContext {
  q?: string;
  filters?: Filters;
}

const SEARCH_DEFAULTS: SearchServiceSettings = {
  input: '',
  filterConfig: {},
  filterPanelActive: false,
  filters: {},
  placeholder: i18n.global.t('searchbar.default-placeholder'),
};

export default class SearchService {
  private input: string;
  private readonly filterConfig: FilterConfig;
  private filterPanelActive: boolean;
  private filters: Filters;
  private readonly placeholder: string;

  constructor(settings: Partial<SearchServiceSettings> = {}) {
    const mergedSettings: SearchServiceSettings = {
      ...SEARCH_DEFAULTS,
      ...settings,
    };

    this.input = mergedSettings.input;
    this.filterConfig = mergedSettings.filterConfig;
    this.filterPanelActive = mergedSettings.filterPanelActive;
    this.filters = mergedSettings.filters;
    this.placeholder = mergedSettings.placeholder;
  }

  get getPlaceholder(): string {
    return this.placeholder;
  }

  get getFilterPanelActive(): boolean {
    return this.filterPanelActive;
  }

  set setFilterPanelActive(active: boolean) {
    this.filterPanelActive = active;
  }

  get getFilters(): Filters {
    return this.filters;
  }

  set setFilters(filters: Filters) {
    this.filters = filters;
  }

  get getFilterConfig(): FilterConfig {
    return this.filterConfig;
  }

  get getInput(): string {
    return this.input;
  }

  set setInput(input: string) {
    this.input = input;
  }

  get context(): SearchContext {
    return SearchService.cleanContext({ q: this.input, filters: this.filters });
  }

  get isFiltered(): boolean {
    return !!this.input || Object.keys(this.filters).length > 0;
  }

  static cleanContext(contextToClean: SearchContext): SearchContext {
    const ctx: SearchContext = {};

    if (contextToClean.q) ctx.q = contextToClean.q;
    if (
      contextToClean.filters &&
      Object.keys(contextToClean.filters).length > 0
    )
      ctx.filters = {};

    if (contextToClean.filters) {
      for (const [filterProp, filter] of Object.entries(
        contextToClean.filters
      )) {
        if (!filter.value) continue;
        if (
          filter.type === 'enum' &&
          Array.isArray(filter.value) &&
          filter.value.length < 1
        )
          continue;

        if (ctx.filters) {
          ctx.filters[filterProp] = filter;
        }
      }
    }

    return ctx;
  }

  static mergeContext(
    target: Partial<SearchContext>,
    source: Partial<SearchContext>
  ): SearchContext {
    return this.cleanContext({
      q: source.q || target.q,
      filters: {
        ...target.filters,
        ...source.filters,
      },
    });
  }
}
