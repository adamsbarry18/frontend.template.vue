export interface UrlFiltersSettings {
  [key: string]: any;
}

const URL_FILTERS_DEFAULTS: UrlFiltersSettings = {};

export default class UrlFiltersService {
  constructor(settings: Partial<UrlFiltersSettings> = {}) {
    const mergedSettings: UrlFiltersSettings = {
      ...URL_FILTERS_DEFAULTS,
      ...settings,
    };
  }
}
