/**
 * Vérifie si une valeur est définie.
 * @param x - La valeur à vérifier.
 * @returns True si la valeur est définie, sinon false.
 */
const isDefined = (x: unknown): boolean => typeof x !== 'undefined';

/**
 * Fonction récursive pour inverser un tableau.
 * @param array - Le tableau à inverser.
 * @returns Un nouveau tableau inversé.
 */
export const reverse = <T>([first, ...rest]: T[]): T[] =>
  isDefined(first) ? [...reverse(rest), first] : [];

/**
 * Regroupe les éléments d'un tableau en fonction d'une propriété spécifiée.
 * @param array - Le tableau d'objets à regrouper.
 * @param prop - La propriété utilisée pour le regroupement.
 * @returns Un objet où les clés sont les valeurs de la propriété spécifiée et les valeurs sont des tableaux des éléments correspondants.
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  prop: keyof T
): Record<string, T[]> => {
  return array.reduce(
    (groups, item) => {
      const val = item[prop];
      if (!groups[val]) {
        groups[val] = [];
      }
      groups[val].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
};
