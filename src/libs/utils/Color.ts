import tinycolor from 'tinycolor2';
import { getCssVariable } from './Style';

/**
 * Convertit une couleur hexadécimale en un tableau RGB.
 * @param hex - Chaîne de couleur hexadécimale (par exemple, "#FFFFFF" ou "FFFFFF").
 * @returns Un tableau contenant les valeurs RGB [rouge, vert, bleu].
 */
export function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const rgb = [0, 2, 4].map((start) => parseInt(cleanHex.slice(start, start + 2), 16)) as [
    number,
    number,
    number,
  ];
  return rgb;
}

/**
 * Détermine la couleur de texte contrastante (clair ou foncé) en fonction de la couleur d'arrière-plan fournie.
 * @param color - Chaîne de couleur hexadécimale (par exemple, "#000000").
 * @returns 'light' ou 'dark' selon le contraste de la couleur.
 */
export function getColorContrast(color?: string | null): 'light' | 'dark' {
  if (!color) {
    return 'light';
  }
  const colorRgb = hexToRgb(color);
  const yiq = (colorRgb[0] * 299 + colorRgb[1] * 587 + colorRgb[2] * 114) / 1000;
  return yiq >= 160 ? 'dark' : 'light';
}

/**
 * Éclaircit une couleur hexadécimale donnée.
 * @param color - Chaîne de couleur hexadécimale (par exemple, "#808080").
 * @param amount - Pourcentage d'éclaircissement (par défaut 10).
 * @param alpha - Valeur alpha (opacité) (par défaut 1).
 * @returns Chaîne de couleur au format HSL.
 */
export function lightenColor(color: string, amount = 10, alpha = 1): string {
  return tinycolor(color).lighten(amount).setAlpha(alpha).toHslString();
}

/**
 * Récupère la palette de couleurs à utiliser dans les graphiques ECharts.
 * @returns Un tableau de chaînes de couleurs.
 */
export function getGraphColorPalette(): string[] {
  return [
    getCssVariable('--color-dataviz-1'),
    getCssVariable('--color-dataviz-2'),
    getCssVariable('--color-dataviz-3'),
    getCssVariable('--color-dataviz-4'),
    getCssVariable('--color-dataviz-5'),
    getCssVariable('--color-dataviz-6'),
  ];
}

/**
 * Récupère la palette de couleurs héritée à utiliser dans les graphiques ECharts.
 * @returns Un tableau de chaînes de couleurs.
 */
export function getGraphColorLegacyPalette(): string[] {
  return [
    getCssVariable('--color-legacy-dataviz-1'),
    getCssVariable('--color-legacy-dataviz-2'),
    getCssVariable('--color-legacy-dataviz-3'),
    getCssVariable('--color-legacy-dataviz-4'),
    getCssVariable('--color-legacy-dataviz-5'),
    getCssVariable('--color-legacy-dataviz-6'),
    getCssVariable('--color-legacy-dataviz-7'),
    getCssVariable('--color-legacy-dataviz-8'),
    getCssVariable('--color-legacy-dataviz-9'),
    getCssVariable('--color-legacy-dataviz-10'),
    getCssVariable('--color-legacy-dataviz-11'),
  ];
}
