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

export function setVisibility({ column, value }: SetVisibilityParams): void {
  let columnVisibility: Record<string, VisibilityValue> | null = JSON.parse(
    userStorage.getItem('column-visibility') || 'null'
  );
  if (!columnVisibility) {
    columnVisibility = {};
  }
  columnVisibility[column] = value;
  userStorage.setItem('column-visibility', JSON.stringify(columnVisibility));
}

interface SortValue {
  prop: string | null;
  order: string | null;
}

interface SetSortParams {
  list: string;
  value: SortValue;
}

export function setSort({ list, value }: SetSortParams): void {
  let listSort: Record<string, SortValue> | null = JSON.parse(
    userStorage.getItem('list-sort') || 'null'
  );
  if (!listSort) {
    listSort = {};
  }
  listSort[list] = value;
  userStorage.setItem('list-sort', JSON.stringify(listSort));
}

export function getListSort(listKey: string): SortValue {
  const columnSort: Record<string, SortValue> | null = JSON.parse(
    userStorage.getItem('list-sort') || 'null'
  );
  if (!columnSort || !columnSort.hasOwnProperty(listKey)) {
    return { prop: null, order: null };
  }
  return columnSort[listKey];
}

export function isColumnVisible(columnKey: string): boolean {
  const columnVisibility: Record<string, VisibilityValue> | null = JSON.parse(
    userStorage.getItem('column-visibility') || 'null'
  );
  return !!columnVisibility?.[columnKey];
}

export function hasSavedVisibility(columnKey: string): boolean {
  const columnVisibility: Record<string, VisibilityValue> | null = JSON.parse(
    userStorage.getItem('column-visibility') || 'null'
  );
  return columnVisibility ? columnVisibility.hasOwnProperty(columnKey) : false;
}

export function hasSavedSort(listKey: string): boolean {
  const savedSort: Record<string, SortValue> | null = JSON.parse(
    userStorage.getItem('list-sort') || 'null'
  );
  return savedSort ? savedSort.hasOwnProperty(listKey) : false;
}
