/**
 * Récupère la valeur d'une variable CSS.
 * @param variable - Le nom de la variable CSS (par exemple, '--ma-variable').
 * @returns La valeur de la variable CSS sous forme de chaîne de caractères.
 */
export function getCssVariable(variable: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}
