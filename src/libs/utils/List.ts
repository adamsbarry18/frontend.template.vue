// On peut utiliser le localStorage du navigateur
const userStorage: Storage = window.localStorage;

export const LIST_COLUMN_VISIBILITY = {
  ALWAYS: 'always',
  VISIBLE: 'visible',
  INVISIBLE: 'invisible',
};

type VisibilityValue =
  (typeof LIST_COLUMN_VISIBILITY)[keyof typeof LIST_COLUMN_VISIBILITY];

interface SetVisibilityParams {
  column: string;
  value: VisibilityValue;
}

export function setVisibility(
  { column, value }: SetVisibilityParams,
  prefix: string = 'pulse'
): void {
  let columnVisibility: Record<string, VisibilityValue> | null = JSON.parse(
    userStorage.getItem(`${prefix}.column-visibility`) || 'null'
  );
  if (!columnVisibility) {
    columnVisibility = {};
  }
  columnVisibility[column] = value;
  userStorage.setItem(
    `${prefix}.column-visibility`,
    JSON.stringify(columnVisibility)
  );
}

interface SortValue {
  prop: string | null;
  order: string | null;
}

interface SetSortParams {
  list: string;
  value: SortValue;
}

export function setSort(
  { list, value }: SetSortParams,
  prefix: string = 'pulse'
): void {
  let listSort: Record<string, SortValue> | null = JSON.parse(
    userStorage.getItem(`${prefix}.list-sort`) || 'null'
  );
  if (!listSort) {
    listSort = {};
  }
  listSort[list] = value;
  userStorage.setItem(`${prefix}.list-sort`, JSON.stringify(listSort));
}

export function getListSort(
  listKey: string,
  prefix: string = 'pulse'
): SortValue {
  const columnSort: Record<string, SortValue> | null = JSON.parse(
    userStorage.getItem(`${prefix}.list-sort`) || 'null'
  );
  if (
    !columnSort ||
    !Object.prototype.hasOwnProperty.call(columnSort, listKey)
  ) {
    return { prop: null, order: null };
  }
  return columnSort[listKey];
}

export function isColumnVisible(
  columnKey: string,
  prefix: string = 'pulse'
): boolean {
  const columnVisibility: Record<string, VisibilityValue> | null = JSON.parse(
    userStorage.getItem(`${prefix}.column-visibility`) || 'null'
  );
  return !!columnVisibility?.[columnKey];
}

export function hasSavedVisibility(
  columnKey: string,
  prefix: string = 'pulse'
): boolean {
  const columnVisibility: Record<string, VisibilityValue> | null = JSON.parse(
    userStorage.getItem(`${prefix}.column-visibility`) || 'null'
  );
  return columnVisibility
    ? Object.prototype.hasOwnProperty.call(columnVisibility, columnKey)
    : false;
}

export function hasSavedSort(
  listKey: string,
  prefix: string = 'pulse'
): boolean {
  const savedSort: Record<string, SortValue> | null = JSON.parse(
    userStorage.getItem(`${prefix}.list-sort`) || 'null'
  );
  return savedSort
    ? Object.prototype.hasOwnProperty.call(savedSort, listKey)
    : false;
}
