export interface FilterConfig {
  type: 'enum' | 'bool' | 'numberrange' | 'daterange' | string;
  property: string;
  function?: (row: any, filterValue: any, config: FilterConfig) => boolean;
}

export type FilterFunction = (
  row: any,
  filterValue: any,
  config: FilterConfig
) => boolean;

export function applyFiltersToList<T>(
  rows: T[],
  filters: Record<string, any>,
  config: Record<string, FilterConfig>
): T[] {
  let res = [...rows];
  for (const key of Object.keys(filters)) {
    res = res.filter((row) => applyFilter(row, filters[key], config[key]));
  }
  return res;
}

const filterFunctions: Record<string, FilterFunction> = {
  enum: filterEnum,
  bool: filterBool,
  numberrange: filterNumberrange,
  daterange: filterDaterange,
};

function applyFilter(
  row: any,
  filterValue: any,
  config: FilterConfig
): boolean {
  if (filterValue === null) {
    return true;
  }
  if (typeof config.function === 'function') {
    return config.function(row, filterValue, config);
  }
  if (Object.prototype.hasOwnProperty.call(filterFunctions, config.type)) {
    return filterFunctions[config.type](row, filterValue, config);
  }
  return false;
}

export function filterEnum(
  row: any,
  filterValue: any,
  config: FilterConfig
): boolean {
  const value = getPropValue(row, config.property);
  return Array.isArray(filterValue) && filterValue.length > 0
    ? filterValue.includes(value)
    : true;
}

export function filterBool(
  row: any,
  filterValue: any,
  config: FilterConfig
): boolean {
  const value = getPropValue(row, config.property);
  return filterValue === value;
}

export function filterNumberrange(
  row: any,
  filterValue: any,
  config: FilterConfig
): boolean {
  const value = getPropValue(row, config.property);
  if (!Array.isArray(filterValue) || filterValue.length !== 2) {
    return true;
  }
  const [min, max] = filterValue;
  if (Number.isFinite(min) && value < min) {
    return false;
  }
  if (Number.isFinite(max) && value > max) {
    return false;
  }
  return true;
}

export function filterDaterange(
  row: any,
  filterValue: any,
  config: FilterConfig
): boolean {
  const value = getPropValue(row, config.property);
  const dateValue = new Date(value);
  const startDate = new Date(filterValue[0]);
  if (filterValue[1] === null) {
    return dateValue >= startDate && dateValue <= new Date();
  }
  const endDate = new Date(filterValue[1]);
  return dateValue >= startDate && dateValue <= endDate;
}

export function getPropValue(row: any, property: string): any {
  const propertyPath = property.split('.');
  let value: any = row;
  for (const key of propertyPath) {
    if (value == null || !Object.prototype.hasOwnProperty.call(value, key)) {
      return null;
    }
    value = value[key];
  }
  return value;
}
