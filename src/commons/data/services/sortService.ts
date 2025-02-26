export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export interface SortChoice {
  label: string;
  prop: string;
  order: SortOrder;
}

export interface SortServiceSettings {
  choices: SortChoice[];
  defaultProp: string | null;
  defaultOrder: SortOrder;
  placeholder: string | null;
}

export interface SortContext {
  sort?: {
    prop?: string;
    order?: SortOrder;
  };
}

export interface SelectOption {
  label: string;
  value: number;
}

const SORT_DEFAULTS: SortServiceSettings = {
  choices: [],
  defaultProp: null,
  defaultOrder: SortOrder.ASCENDING,
  placeholder: null,
};

export default class SortService {
  private readonly choices: SortChoice[];
  private prop: string | null;
  private order: SortOrder;
  private readonly placeholder: string | null;

  static readonly ORDER_ASC: SortOrder = SortOrder.ASCENDING;
  static readonly ORDER_DESC: SortOrder = SortOrder.DESCENDING;

  constructor(settings: Partial<SortServiceSettings> = {}) {
    const mergedSettings: SortServiceSettings = {
      ...SORT_DEFAULTS,
      ...settings,
    };

    this.choices = mergedSettings.choices;
    this.prop = mergedSettings.defaultProp;
    this.order = mergedSettings.defaultOrder;
    this.placeholder = mergedSettings.placeholder;
  }

  get getPlaceholder(): string | null {
    return this.placeholder;
  }

  get selectValue(): number {
    return this.choices.findIndex((choice) => choice.prop === this.prop);
  }

  set selectValue(value: number) {
    const choice = this.choices[value];
    if (choice) {
      this.prop = choice.prop;
      this.order = choice.order;
    }
  }

  get selectOptions(): SelectOption[] {
    const options: SelectOption[] = [];

    for (let i = 0; i < this.choices.length; i++) {
      options.push({
        label: this.choices[i].label,
        value: i,
      });
    }

    return options;
  }

  get context(): SortContext | null {
    if (!this.prop || !this.order) return null;

    return {
      sort: { prop: this.prop, order: this.order },
    };
  }

  static mergeContext(
    target: Partial<SortContext>,
    source: Partial<SortContext>
  ): SortContext {
    return {
      sort: {
        prop: source.sort?.prop || target.sort?.prop,
        order: source.sort?.order || target.sort?.order,
      },
    };
  }

  orderBy(prop: string, order: SortOrder = SortOrder.ASCENDING): void {
    this.prop = prop;
    this.order = order;
  }
}
