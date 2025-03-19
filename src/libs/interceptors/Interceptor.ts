import { SecurityInterceptor } from './SecurityInterceptor';
// import { CacheInterceptor } from './CacheInterceptor';
import { PendingInterceptor } from './PendingInterceptor';
import { PaginationInterceptor } from './PaginationInterceptor';
import { Router } from 'vue-router'; // Typage pour Vue Router
import { I18n } from 'vue-i18n'; // Typage pour vue-i18n

// Interface pour typer les options passées à la fonction register
interface RegisterOptions {
  store: any;
  router: Router;
  i18n: I18n;
}

/**
 * Enregistre les intercepteurs pour les requêtes HTTP.
 * @param options - Objet contenant le store, le router et l'i18n
 */
function register(options: RegisterOptions): void {
  const { store, router, i18n } = options;

  // Intercepteur pour limiter les requêtes GET concurrentes à une seule par route
  const interceptorPending = new PendingInterceptor({ store, router, i18n });
  interceptorPending.register();

  // Intercepteur pour la mise en cache des requêtes GET (commenté dans le code d'origine)
  // const interceptorCache = new CacheInterceptor({ store, router, i18n });
  // interceptorCache.register();

  // Intercepteur pour gérer la pagination
  const interceptorPagination = new PaginationInterceptor({
    store,
    router,
    i18n,
  });
  interceptorPagination.register();

  // Intercepteur de sécurité pour la gestion des tokens (enregistré en dernier)
  const interceptorSecurity = new SecurityInterceptor({ store, router, i18n });
  interceptorSecurity.register();
}

export { register };
