import { SecurityInterceptor } from './SecurityInterceptor';
import { PendingInterceptor } from './PendingInterceptor';
import { PaginationInterceptor } from './PaginationInterceptor';
import { CacheInterceptor } from './CacheInterceptor';
import { Router } from 'vue-router';
import { I18n } from 'vue-i18n';

// Interface pour typer les options passées à la fonction register
interface RegisterOptions {
  router: Router;
  i18n: I18n;
}

/**
 * Enregistre les intercepteurs pour les requêtes HTTP.
 * @param options - Objet contenant le router et l'i18n
 */
function registerInterceptor(options: RegisterOptions): void {
  const { router, i18n } = options;

  // Intercepteur pour limiter les requêtes GET concurrentes à une seule par route
  const interceptorPending = new PendingInterceptor({ router, i18n });
  interceptorPending.register();
  const interceptorCache = new CacheInterceptor({ router, i18n });
  interceptorCache.register();

  // Intercepteur pour gérer la pagination
  const interceptorPagination = new PaginationInterceptor({
    router,
    i18n,
  });
  interceptorPagination.register();

  // Intercepteur de sécurité pour la gestion des tokens (enregistré en dernier)
  const interceptorSecurity = new SecurityInterceptor({ router, i18n });
  interceptorSecurity.register();
}

export { registerInterceptor };
