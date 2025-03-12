type OrderType = 'ascending' | 'descending';

interface SortChoice {
  label: string;
  prop: string;
  order: OrderType;
}

interface SortServiceSettings {
  choices?: SortChoice[];
  defaultProp?: string | null;
  defaultOrder?: OrderType;
  placeholder?: string | null;
}

interface SortContext {
  sort: {
    prop: string | null;
    order: OrderType | null;
  };
}

interface SelectOption {
  label: string;
  value: number;
}

export default class SortService {
  private _choices: SortChoice[];
  private _prop: string | null;
  private _order: OrderType | null;
  private _placeholder: string | null;

  static ORDER_ASC: OrderType = 'ascending';
  static ORDER_DESC: OrderType = 'descending';

  constructor(settings: SortServiceSettings = sortDefault) {
    const mSettings = Object.assign({}, sortDefault, settings);

    this._choices = mSettings.choices!;
    this._prop = mSettings.defaultProp;
    this._order = mSettings.defaultOrder!;
    this._placeholder = mSettings.placeholder;
  }

  get placeholder(): string | null {
    return this._placeholder;
  }

  get selectValue(): number {
    return this._choices.findIndex((choice) => choice.prop === this._prop);
  }

  set selectValue(value: number) {
    const choice = this._choices[value];
    this._prop = choice.prop;
    this._order = choice.order;
  }

  get selectOptions(): SelectOption[] {
    const options: SelectOption[] = [];

    for (let i = 0; i < this._choices.length; i++) {
      options.push({
        label: this._choices[i].label,
        value: i,
      });
    }

    return options;
  }

  get context(): SortContext | null {
    if (!this._prop || !this._order) return null;

    return {
      sort: { prop: this._prop, order: this._order },
    };
  }

  static mergeContext(
    target: SortContext | null,
    source: SortContext | null
  ): SortContext {
    return {
      sort: {
        prop: source?.sort?.prop || target?.sort?.prop || null,
        order: source?.sort?.order || target?.sort?.order || null,
      },
    };
  }

  orderBy(prop: string, order: OrderType = SortService.ORDER_ASC): void {
    this._prop = prop;
    this._order = order;
  }
}

const sortDefault: SortServiceSettings = {
  choices: [],
  defaultProp: null,
  defaultOrder: SortService.ORDER_ASC,
  placeholder: null,
};
