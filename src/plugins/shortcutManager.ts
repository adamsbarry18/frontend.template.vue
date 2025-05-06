import type { App } from 'vue';

type ShortcutFunction = () => void;
const queues: Record<string, ShortcutFunction[]> = {};
let enable = true;
const lastKeys: string[] = [];

// Routes désactivant les raccourcis
const shortcutDisabledRoutes = ['login', 'forgot-password', 'reset-password'];

/**
 * Gère l'événement `keyup` et vérifie les raccourcis.
 */
function onKeyUp(event: KeyboardEvent): void {
  if (shortcutDisabledRoutes.some((route) => window.location.hash.includes(route))) {
    return;
  }

  const isUserOnInput = event
    .composedPath()
    .some(
      (el) =>
        el instanceof HTMLElement &&
        (el.nodeName.toLowerCase() === 'input' || el.classList.contains('label-name'))
    );

  if (!isUserOnInput) {
    shortcutCheck(event);
  }

  konamiCheck(event.key);
}

/**
 * Vérifie et exécute les raccourcis clavier.
 */
function shortcutCheck(event: KeyboardEvent): void {
  if (event.key === 'n') callShortcutFunc('n');
  if (event.key === 'Escape') callShortcutFunc('esc');
}

/**
 * Vérifie si la séquence du Konami Code est entrée.
 */
function konamiCheck(key: string): void {
  lastKeys.push(key);
  if (lastKeys.length > 8) lastKeys.shift();

  const konamiSequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
  ];

  if (lastKeys.length === konamiSequence.length && lastKeys.join(',') === konamiSequence.join(',')) {
    document.body.classList.toggle('konami-code');
  }
}

/**
 * Enregistre une fonction de rappel pour un raccourci donné.
 */
export function registerToShortcutQueue(callFunc: ShortcutFunction, shortcut: string = 'esc'): void {
  if (!queues[shortcut]) queues[shortcut] = [];
  queues[shortcut].unshift(callFunc);
}

/**
 * Exécute la fonction associée à un raccourci.
 */
export function callShortcutFunc(shortcut: string = 'esc'): void {
  if (enable && queues[shortcut] && queues[shortcut].length > 0) {
    queues[shortcut][0]();
    queues[shortcut].shift();
  }
}

/**
 * Supprime une fonction spécifique de la file d'attente d'un raccourci.
 */
export function removeFromShortcutQueue(callFunc: ShortcutFunction, shortcut: string = 'esc'): void {
  if (queues[shortcut]) {
    const index = queues[shortcut].indexOf(callFunc);
    if (index !== -1) {
      queues[shortcut].splice(index, 1);
    }
  }
}

export const pauseShortcuts = () => (enable = false);
export const restartShortcuts = () => setTimeout(() => (enable = true), 200);

export default {
  install(app: App) {
    document.addEventListener('keyup', onKeyUp, true);

    app.config.globalProperties.$registerShortcut = registerToShortcutQueue;
    app.config.globalProperties.$removeShortcut = removeFromShortcutQueue;
    app.config.globalProperties.$pauseShortcuts = pauseShortcuts;
    app.config.globalProperties.$restartShortcuts = restartShortcuts;
  },
};
