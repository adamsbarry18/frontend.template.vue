const MIN_PASSWORD_LENGTH = 8;

/**
 * Vérifie le nombre de caractères supplémentaires au-delà du minimum.
 * Renvoie un pourcentage de points, maximum 40.
 */
function passwordCharPoint(input: string): number {
  if (input && input.length > MIN_PASSWORD_LENGTH) {
    return Math.min(input.length - MIN_PASSWORD_LENGTH, 40);
  }
  if (input && input.length < MIN_PASSWORD_LENGTH) {
    return input.length;
  }
  return 0;
}

/**
 * Vérifie si le mot de passe est suffisamment long.
 * @param input Le mot de passe à vérifier.
 * @returns 15 si la longueur est suffisante, sinon 0.
 */
function passwordLengthCheck(input: string): number {
  return input && input.length >= MIN_PASSWORD_LENGTH ? 15 : 0;
}

/**
 * Vérifie si le mot de passe contient au moins un chiffre.
 */
function passwordNumberCheck(input: string): number {
  const numbers = /[0-9]/g;
  return input && input.match(numbers) ? 15 : 0;
}

/**
 * Vérifie si le mot de passe contient au moins une lettre majuscule.
 */
function passwordUppercaseCheck(input: string): number {
  const upperCaseLetters = /[A-Z]/g;
  return input && input.match(upperCaseLetters) ? 15 : 0;
}

/**
 * Vérifie si le mot de passe contient au moins une lettre minuscule.
 */
function passwordLowercaseCheck(input: string): number {
  const lowerCaseLetters = /[a-z]/g;
  return input && input.match(lowerCaseLetters) ? 5 : 0;
}

/**
 * Vérifie si le mot de passe contient au moins un caractère spécial.
 */
function passwordSpecialCharacterCheck(input: string): number {
  const specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/g;
  return input && input.match(specialCharacters) ? 15 : 0;
}

/**
 * Tableau de règles de validation du mot de passe,
 * utilisé pour calculer le pourcentage de force dans APasswordInput.
 * La somme des points doit être comprise entre 0 et 100.
 */
export const passwordRules: Array<(input: string) => number> = [
  passwordLengthCheck,
  passwordNumberCheck,
  passwordUppercaseCheck,
  passwordLowercaseCheck,
  passwordSpecialCharacterCheck,
  passwordCharPoint,
];

/**
 * Objet de fonctions validatrices pour le mot de passe, utilisable par exemple avec vuelidate.
 */
export const passwordValidators = {
  isLength(value: string): boolean {
    return passwordLengthCheck(value) !== 0;
  },
  haveLowercase(value: string): boolean {
    return passwordLowercaseCheck(value) !== 0;
  },
  haveUppercase(value: string): boolean {
    return passwordUppercaseCheck(value) !== 0;
  },
  haveNumber(value: string): boolean {
    return passwordNumberCheck(value) !== 0;
  },
  haveSpecialCharacter(value: string): boolean {
    return passwordSpecialCharacterCheck(value) !== 0;
  },
};

/**
 * Retourne un objet contenant l'état (true ou false) de chaque validateur.
 * @param value Le mot de passe à valider.
 * @returns Un objet dont chaque clé correspond à un validateur.
 */
export function getPasswordIndicators(value: string): Record<string, boolean> {
  const indicators: Record<string, boolean> = {};
  for (const [validatorKey, validator] of Object.entries(passwordValidators)) {
    indicators[validatorKey] = validator(value);
  }
  return indicators;
}

/**
 * Vérifie qu'un mot de passe est sécurisé en passant tous les validateurs.
 * @param value Le mot de passe à vérifier.
 * @returns True si tous les validateurs renvoient true, sinon false.
 */
export function isPasswordSecure(value: string): boolean {
  return Object.values(getPasswordIndicators(value)).every(
    (indicator) => indicator === true
  );
}

/**
 * Hash d'un email en SHA-256.
 * @param email L'email à hasher.
 * @returns Une promesse contenant le hash hexadécimal.
 */
export async function hashEmail256(email: string): Promise<string> {
  const utf8 = new TextEncoder().encode(email);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Fonction de hash synchronisée simple.
 * @param value La chaîne à hasher.
 * @param seed Une valeur de départ (optionnelle).
 * @returns Un nombre représentant le hash.
 */
export function cyrb53(value: string, seed: number = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch: number; i < value.length; i++) {
    ch = value.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
