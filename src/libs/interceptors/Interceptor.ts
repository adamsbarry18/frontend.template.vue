import { SecurityInterceptor } from './SecurityInterceptor';
import { PendingInterceptor } from './PendingInterceptor'; // Réactiver
import { PaginationInterceptor } from './PaginationInterceptor';
import { CacheInterceptor } from './CacheInterceptor'; // Réactiver
import { Router } from 'vue-router';
import { I18n } from 'vue-i18n';
// Importer l'instance Axios réelle, pas le store
import { apiClient } from '@/stores/modules/api';

// Interface pour typer les options passées à la fonction register
interface RegisterOptions {
  router: Router;
  i18n: I18n;
}

/**
 * Enregistre les intercepteurs pour les requêtes HTTP sur l'instance Axios du store API.
 * @param options - Objet contenant le router et l'i18n
 */
function registerInterceptor(options: RegisterOptions): void {
  const { router, i18n } = options;
  // Utiliser l'instance Axios importée directement
  const axiosInstance = apiClient;

  // Intercepteur de sécurité pour la gestion des tokens (enregistré en premier pour garantir l'ajout du header)
  const interceptorSecurity = new SecurityInterceptor({
    router,
    i18n,
    axiosInstance,
  }); // Passer l'instance
  interceptorSecurity.register();

  // Intercepteur pour limiter les requêtes GET concurrentes à une seule par route
  const interceptorPending = new PendingInterceptor({
    router,
    i18n,
    axiosInstance,
  }); // Passer l'instance
  interceptorPending.register(); // Réactiver
  const interceptorCache = new CacheInterceptor({
    router,
    i18n,
    axiosInstance,
  }); // Passer l'instance
  interceptorCache.register(); // Réactiver

  // Intercepteur pour gérer la pagination
  const interceptorPagination = new PaginationInterceptor({
    router,
    i18n,
    axiosInstance, // Passer l'instance
  });
  interceptorPagination.register();
}

export { registerInterceptor };
