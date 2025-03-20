interface UrlFiltersSettings {
  [key: string]: any;
}

const urlFiltersDefault: UrlFiltersSettings = {};

export default class UrlFiltersService {
  constructor(settings: UrlFiltersSettings = urlFiltersDefault) {
    // Fixed the object assignment to avoid mutating defaults
    Object.assign({}, urlFiltersDefault, settings);
  }
}
