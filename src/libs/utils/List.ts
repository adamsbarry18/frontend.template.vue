import { storageService } from './StorageService'; // Importer le service

export const LIST_COLUMN_VISIBILITY = {
  ALWAYS: 'always',
  VISIBLE: 'visible',
  INVISIBLE: 'invisible',
};

type VisibilityValue = (typeof LIST_COLUMN_VISIBILITY)[keyof typeof LIST_COLUMN_VISIBILITY];

interface SetVisibilityParams {
  column: string;
  value: VisibilityValue;
}

export function setVisibility({ column, value }: SetVisibilityParams): void {
  // Utiliser storageService pour récupérer et définir la visibilité
  const columnVisibility = storageService.getColumnVisibility<Record<string, VisibilityValue>>() ?? {};
  columnVisibility[column] = value;
  storageService.setColumnVisibility(columnVisibility);
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
  // Utiliser storageService pour récupérer et définir le tri
  const listSort = storageService.getListSort<Record<string, SortValue>>() ?? {};
  listSort[list] = value;
  storageService.setListSort(listSort);
}

export function getListSort(listKey: string): SortValue {
  // Utiliser storageService pour récupérer le tri
  const listSort = storageService.getListSort<Record<string, SortValue>>();
  return listSort?.[listKey] ?? { prop: null, order: null };
}

export function isColumnVisible(columnKey: string): boolean {
  // Utiliser storageService pour vérifier la visibilité
  const columnVisibility = storageService.getColumnVisibility<Record<string, VisibilityValue>>();
  // Vérifier si la clé existe et si la valeur n'est pas 'invisible' (ou une autre logique si nécessaire)
  // Ici, on vérifie simplement si la clé existe dans l'objet récupéré.
  return !!columnVisibility?.[columnKey];
}

export function hasSavedVisibility(columnKey: string): boolean {
  // Utiliser storageService pour vérifier si une visibilité est sauvegardée
  const columnVisibility = storageService.getColumnVisibility<Record<string, VisibilityValue>>();
  return !!columnVisibility && columnVisibility.hasOwnProperty(columnKey);
}

export function hasSavedSort(listKey: string): boolean {
  // Utiliser storageService pour vérifier si un tri est sauvegardé
  const listSort = storageService.getListSort<Record<string, SortValue>>();
  return !!listSort && listSort.hasOwnProperty(listKey);
}
