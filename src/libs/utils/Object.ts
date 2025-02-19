/**
 * Divise les clés d'un objet en sous-objets en utilisant un séparateur.
 * @param obj - L'objet à traiter.
 * @param separator - Le séparateur utilisé pour diviser les clés.
 * @returns Un nouvel objet avec les clés divisées en sous-objets.
 */
export function objectToSplitLabel(
  obj: Record<string, any>,
  separator: string
): Record<string, any> {
  return Object.keys(obj).reduce(
    (acc, label) => {
      const name = label.split(separator);

      if (name.length > 1) {
        if (!acc[name[0]]) {
          acc[name[0]] = {};
        }
        acc[name[0]][name[1]] = obj[label];
      } else {
        acc[label] = obj[label];
      }
      return acc;
    },
    {} as Record<string, any>
  );
}

/**
 * Compare superficiellement deux objets pour vérifier s'ils sont égaux.
 * @param a - Premier objet à comparer.
 * @param b - Second objet à comparer.
 * @returns `true` si les objets sont égaux, sinon `false`.
 */
export function shallowObject(
  a: Record<string, any> | null | undefined,
  b: Record<string, any> | null | undefined
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }

  return true;
}

/**
 * Crée une copie profonde d'un objet.
 * @param obj - L'objet à copier.
 * @returns Une nouvelle instance de l'objet.
 */
export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Attend qu'une variable globale soit définie.
 * @param variable - Nom de la variable à surveiller.
 * @param expire - Temps maximal d'attente en millisecondes.
 * @returns Une promesse résolue avec la valeur de la variable ou rejetée en cas d'expiration.
 */
export function wait(variable: string, expire?: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkVariable = () => {
      try {
        // eslint-disable-next-line no-eval
        const value = eval(variable);
        if (typeof value !== 'undefined') {
          resolve(value);
        } else if (expire && Date.now() - startTime > expire) {
          reject(
            new Error(`Variable "${variable}" non définie après ${expire} ms`)
          );
        } else {
          setTimeout(checkVariable, 250);
        }
      } catch (error) {
        if (expire && Date.now() - startTime > expire) {
          reject(error);
        } else {
          setTimeout(checkVariable, 250);
        }
      }
    };

    checkVariable();
  });
}

/**
 * Vérifie si une valeur est un objet.
 * @param value - La valeur à vérifier.
 * @returns `true` si la valeur est un objet, sinon `false`.
 */
export function isObject(value: any): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Récupère une propriété d'un objet en utilisant un chemin de chaîne de caractères.
 * @param object - L'objet à parcourir.
 * @param path - Le chemin de la propriété à récupérer.
 * @param separator - Le séparateur utilisé dans le chemin (par défaut '.').
 * @returns La valeur de la propriété si elle existe, sinon `undefined`.
 */
export function getWithPath(
  object: Record<string, any>,
  path: string,
  separator: string = '.'
): any {
  return path.split(separator).reduce((acc, key) => acc?.[key], object);
}
