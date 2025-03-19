import { ref } from 'vue';

// État réactif pour la visibilité du dialogue
const isVisible = ref(false);

// Variable pour stocker la promesse déférée
let deferredPromise: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
} | null = null;

/**
 * Génère et retourne une promesse, dont les méthodes resolve/reject sont stockées.
 */
function generateReturnPromise(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    deferredPromise = { resolve, reject };
  });
}

/**
 * Ouvre le dialogue et retourne une promesse qui sera résolue ou rejetée selon l'action.
 */
function openDialog(): Promise<unknown> {
  isVisible.value = true;
  return generateReturnPromise();
}

/**
 * Annule le dialogue, rejette la promesse et masque le dialogue.
 */
function cancelDialog(): void {
  if (deferredPromise) {
    deferredPromise.reject({ result: 'cancel' });
  }
  isVisible.value = false;
}

/**
 * Valide le dialogue avec des données et masque le dialogue.
 * @param data Données à renvoyer
 * @param result Résultat (par défaut 'success')
 */
function successDialog(data: unknown, result: string = 'success'): void {
  if (deferredPromise) {
    deferredPromise.resolve({ result, data });
  }
  isVisible.value = false;
}

// Exportation des fonctions si besoin (par exemple pour un usage dans le template)
export { isVisible, openDialog, cancelDialog, successDialog };
