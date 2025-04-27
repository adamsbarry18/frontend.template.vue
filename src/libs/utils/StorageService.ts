/**
 * Service pour interagir avec le Local Storage du navigateur de manière sécurisée.
 * Vérifie la disponibilité de window.localStorage avant chaque opération.
 */
const AUTH_TOKEN_KEY = 'authToken';
const LANGUAGE_KEY = 'language';
const COLUMN_VISIBILITY_KEY = 'column-visibility';
const LIST_SORT_KEY = 'list-sort';

/**
 * Récupère une valeur depuis le localStorage.
 * @param key La clé de l'élément à récupérer.
 * @returns La valeur sous forme de chaîne, ou null si la clé n'existe pas ou si localStorage n'est pas disponible.
 */
function getItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  console.warn('LocalStorage is not available.');
  return null;
}

/**
 * Enregistre une valeur dans le localStorage.
 * @param key La clé de l'élément à enregistrer.
 * @param value La valeur à enregistrer (sera convertie en chaîne).
 */
function setItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item "${key}" in LocalStorage:`, error);
      // Gérer potentiellement les erreurs de quota (localStorage plein)
    }
  } else {
    console.warn('LocalStorage is not available.');
  }
}

/**
 * Supprime une valeur du localStorage.
 * @param key La clé de l'élément à supprimer.
 */
function removeItem(key: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
  } else {
    console.warn('LocalStorage is not available.');
  }
}

/**
 * Récupère un objet JSON depuis le localStorage.
 * @param key La clé de l'objet à récupérer.
 * @returns L'objet parsé, ou null en cas d'erreur ou si la clé n'existe pas.
 */
function getJsonItem<T>(key: string): T | null {
  const item = getItem(key);
  if (item) {
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(
        `Error parsing JSON from LocalStorage for key "${key}":`,
        error
      );
      // Optionnel : supprimer l'élément invalide
      // removeItem(key);
      return null;
    }
  }
  return null;
}

/**
 * Enregistre un objet JSON dans le localStorage.
 * @param key La clé sous laquelle enregistrer l'objet.
 * @param value L'objet à enregistrer (sera sérialisé en JSON).
 */
function setJsonItem<T>(key: string, value: T): void {
  try {
    const jsonValue = JSON.stringify(value);
    setItem(key, jsonValue);
  } catch (error) {
    console.error(
      `Error stringifying object for LocalStorage key "${key}":`,
      error
    );
  }
}

// Fonctions spécifiques pour les clés courantes

export const storageService = {
  // Auth Token
  getAuthToken: (): string | null => getItem(AUTH_TOKEN_KEY),
  setAuthToken: (token: string): void => setItem(AUTH_TOKEN_KEY, token),
  removeAuthToken: (): void => removeItem(AUTH_TOKEN_KEY),

  // Language Preference
  getLanguage: (): string | null => getItem(LANGUAGE_KEY),
  setLanguage: (lang: string): void => setItem(LANGUAGE_KEY, lang),
  removeLanguage: (): void => removeItem(LANGUAGE_KEY),

  // List Column Visibility (JSON)
  getColumnVisibility: <T>(): T | null => getJsonItem<T>(COLUMN_VISIBILITY_KEY),
  setColumnVisibility: <T>(visibility: T): void =>
    setJsonItem(COLUMN_VISIBILITY_KEY, visibility),
  removeColumnVisibility: (): void => removeItem(COLUMN_VISIBILITY_KEY),

  // List Sort Settings (JSON)
  getListSort: <T>(): T | null => getJsonItem<T>(LIST_SORT_KEY),
  setListSort: <T>(sort: T): void => setJsonItem(LIST_SORT_KEY, sort),
  removeListSort: (): void => removeItem(LIST_SORT_KEY),

  // Generic methods (peuvent être utiles pour d'autres usages)
  getItem,
  setItem,
  removeItem,
  getJsonItem,
  setJsonItem,
};
