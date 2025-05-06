export const getValueByPath = (object: any, prop: string = ''): any => {
  const paths: string[] = prop.split('.');
  let current: any = object;
  let result: any = null;
  for (let i = 0, len = paths.length; i < len; i++) {
    const path = paths[i];
    if (!current) break;
    if (i === len - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};

const isObject = (obj: any): obj is Record<string, any> => {
  return obj !== null && typeof obj === 'object';
};

export type SortMethod<T> = (a: T, b: T) => number;

export function orderBy<T>(
  array: T[],
  sortKey: string | null,
  reverseParam: string | number,
  sortMethod?: SortMethod<T>,
  sortByParam?:
    | string
    | ((value: T, index: number, array: T[]) => any)
    | Array<string | ((value: T, index: number, array: T[]) => any)>
): T[] {
  if (!sortKey && !sortMethod && (!sortByParam || (Array.isArray(sortByParam) && sortByParam.length === 0))) {
    return array;
  }

  let reverse: number;
  if (typeof reverseParam === 'string') {
    reverse = reverseParam === 'descending' ? -1 : 1;
  } else {
    reverse = reverseParam < 0 ? -1 : 1;
  }

  // getKey: if no custom sort method is provided, build a key based on sortByParam or sortKey.
  const getKey = sortMethod
    ? null
    : function (value: T, index: number): any[] {
        if (sortByParam) {
          let sortByArr: Array<string | ((value: T, index: number, array: T[]) => any)>;
          if (!Array.isArray(sortByParam)) {
            sortByArr = [sortByParam];
          } else {
            sortByArr = sortByParam;
          }
          return sortByArr.map((by) => {
            if (typeof by === 'string') {
              return getValueByPath(value, by);
            }
            return by(value, index, array);
          });
        }
        let currentValue: any = value;
        if (sortKey !== '$key') {
          if (isObject(value) && '$value' in (value as Record<string, unknown>)) {
            currentValue = (value as any).$value;
          }
        }
        return [isObject(currentValue) ? getValueByPath(currentValue, sortKey as string) : currentValue];
      };

  type Wrapper = {
    value: T;
    index: number;
    key: any[] | null;
  };

  const wrappers: Wrapper[] = array.map((value, index) => ({
    value,
    index,
    key: getKey ? getKey(value, index) : null,
  }));

  const compare = (a: Wrapper, b: Wrapper): number => {
    if (sortMethod) {
      return sortMethod(a.value, b.value);
    }
    if (a.key && b.key) {
      for (let i = 0, len = a.key.length; i < len; i++) {
        if (a.key[i] < b.key[i]) {
          return -1;
        }
        if (a.key[i] > b.key[i]) {
          return 1;
        }
      }
    }
    return 0;
  };

  wrappers.sort((a, b) => {
    let order = compare(a, b);
    if (!order) {
      // Stable sort fallback: preserve original order when keys are equal.
      order = a.index - b.index;
    }
    return order * reverse;
  });

  return wrappers.map((item) => item.value);
}
