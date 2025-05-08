/**
 * Divise les clés d'un objet en sous-objets en utilisant un séparateur.
 * @param obj - L'objet à traiter.
 * @param separator - Le séparateur utilisé pour diviser les clés.
 * @returns Un nouvel objet avec les clés divisées en sous-objets.
 */
export function objectToSplitLabel(obj: Record<string, any>, separator: string): Record<string, any> {
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
        const parts = variable.split('.');
        let current: any = window;
        
        for (const part of parts) {
          if (current && typeof current === 'object') {
            current = current[part];
          } else {
            current = undefined;
            break;
          }
        }

        if (typeof current !== 'undefined') {
          resolve(current);
        } else if (expire && Date.now() - startTime > expire) {
          reject(new Error(`Variable "${variable}" non définie après ${expire} ms`));
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
export function getWithPath(object: Record<string, any>, path: string, separator: string = '.'): any {
  return path.split(separator).reduce((acc, key) => acc?.[key], object);
}

/**
 * Compare deux objets en profondeur pour vérifier l'égalité de leur contenu.
 * Gère les objets, les tableaux, les dates et les types primitifs.
 * @param obj1 Le premier objet à comparer.
 * @param obj2 Le second objet à comparer.
 * @returns `true` si les objets sont profondément égaux, sinon `false`.
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  // Gérer les cas simples et la comparaison de référence stricte
  if (obj1 === obj2) {
    return true;
  }

  // Gérer null, undefined ou types différents
  if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    // Si l'un n'est pas un objet mais l'autre l'est, ou s'ils sont de types primitifs différents
    return obj1 === obj2; // Compare les primitifs directement
  }

  // Gérer les Dates
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  // Si l'un est une Date et l'autre non
  if (obj1 instanceof Date !== obj2 instanceof Date) {
    return false;
  }

  // Gérer les Tableaux
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }
  // Si l'un est un tableau et l'autre non
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  // Gérer les Objets
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      return false;
    }
    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
