/**
 * Type de fonction de raccourci.
 */
type ShortcutFunction = () => void;

/**
 * File d'attente des raccourcis.
 */
const queues: Record<string, ShortcutFunction[]> = {};

/**
 * Indicateur d'activation du gestionnaire de raccourcis.
 */
let enable = true;

/**
 * Stockage des dernières touches pressées.
 */
const lastKeys: string[] = [];

/**
 * Démarre le gestionnaire de raccourcis.
 */
export function startShortcutManager(): void {
  document.addEventListener('keyup', onKeyUp, true);
}

/**
 * Détruit le gestionnaire de raccourcis.
 */
export function destroyShortcutManager(): void {
  document.removeEventListener('keyup', onKeyUp, true);
}

/**
 * Met en pause le gestionnaire de raccourcis.
 */
export function pauseShortcutManager(): void {
  enable = false;
}

/**
 * Redémarre le gestionnaire de raccourcis après un délai.
 */
export function restartShortcutManager(): void {
  setTimeout(() => {
    enable = true;
  }, 200);
}

/**
 * Liste des routes désactivant les raccourcis.
 */
const shortcutDisabledRoutes: string[] = [
  'login',
  'forgot-password',
  'reset-password',
];

/**
 * Gère l'événement `keyup`.
 * @param event Événement clavier.
 */
function onKeyUp(event: KeyboardEvent): void {
  if (
    shortcutDisabledRoutes.some((route) => window.location.hash.includes(route))
  ) {
    return;
  }

  const isUserOnInput = event
    .composedPath()
    .some(
      (el) =>
        el instanceof HTMLElement &&
        (el.nodeName.toLowerCase() === 'input' ||
          el.classList.contains('label-name'))
    );

  if (!isUserOnInput) {
    shortcutCheck(event);
  }

  konamiCheck(event.key);
}

/**
 * Vérifie et exécute les raccourcis clavier.
 * @param event Événement clavier.
 */
function shortcutCheck(event: KeyboardEvent): void {
  if (event.key === 'n') {
    callShortcutFunc('n');
  }
  if (event.key === 'Escape') {
    callShortcutFunc('esc');
  }
}

/**
 * Vérifie si la séquence du Konami Code est entrée.
 * @param key Touche pressée.
 */
function konamiCheck(key: string): void {
  lastKeys.push(key);
  if (lastKeys.length > 8) {
    lastKeys.shift();
  }
  const keys = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
  ];
  if (
    lastKeys.length === keys.length &&
    lastKeys.join(',') === keys.join(',')
  ) {
    document.body.classList.toggle('konami-code');
  }
}

/**
 * Enregistre une fonction de rappel pour un raccourci donné.
 * @param callFunc Fonction à exécuter lors du déclenchement du raccourci.
 * @param shortcut Nom du raccourci (par défaut: 'esc').
 */
export function registerToShortcutQueue(
  callFunc: ShortcutFunction,
  shortcut: string = 'esc'
): void {
  if (!queues[shortcut]) {
    queues[shortcut] = [];
  }
  queues[shortcut].unshift(callFunc);
}

/**
 * Exécute la fonction associée à un raccourci et la retire de la file.
 * @param shortcut Nom du raccourci (par défaut: 'esc').
 */
export function callShortcutFunc(shortcut: string = 'esc'): void {
  if (enable && queues[shortcut] && queues[shortcut].length > 0) {
    queues[shortcut][0]();
    queues[shortcut].shift();
  }
}

/**
 * Supprime une fonction spécifique de la file d'attente d'un raccourci.
 * @param callFunc Fonction à supprimer.
 * @param shortcut Nom du raccourci (par défaut: 'esc').
 */
export function removeFromShortcutQueue(
  callFunc: ShortcutFunction,
  shortcut: string = 'esc'
): void {
  if (queues[shortcut]) {
    const index = queues[shortcut].indexOf(callFunc);
    if (index !== -1) {
      queues[shortcut].splice(index, 1);
    }
  }
}
