import { BaseInterceptor } from './BaseInterceptor';
import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const cacheable = true;

interface CacheableAxiosRequestConfig extends InternalAxiosRequestConfig<any> {
  cache?: boolean;
  params?: any;
}

const Cache = {
  _items: {} as Record<string, string | null>,
  get(key: string): any {
    return this._items[key] ? JSON.parse(this._items[key] as string) : null;
  },
  set(key: string, value: any): void {
    this._items[key] = JSON.stringify(value);
  },
  del(key: string): void {
    Object.keys(this._items)
      .filter((k) => k.indexOf(key) > -1)
      .forEach((k) => {
        this._items[k] = null;
      });
  },
};

export class CacheInterceptor extends BaseInterceptor {
  public override getType(): string {
    return 'CacheInterceptor';
  }

  public override requestInterceptor() {
    return {
      request: (request: CacheableAxiosRequestConfig): CacheableAxiosRequestConfig => {
        const isCacheable = request.cache !== false;
        // Ne cache que les requêtes GET
        if (request.method === 'get' && cacheable && isCacheable) {
          const key = this.getCacheKey(request);
          const _cached = Cache.get(key);

          if (_cached) {
            // Marquer la réponse comme provenant du cache
            _cached.__fromCache = true;
            request.data = _cached;
            // Définir l'adapter pour renvoyer la réponse en cache et éviter l'exécution de la requête réelle
            request.adapter = () =>
              Promise.resolve({
                data: _cached,
                status: 200,
                statusText: 'OK',
                headers: request.headers,
                config: request,
                request,
              } as AxiosResponse);
          }
        }
        return request;
      },
      error: (error: any) => Promise.reject(error),
    };
  }

  public override responseInterceptor() {
    return {
      response: (response: AxiosResponse): AxiosResponse => {
        const config = response.config as CacheableAxiosRequestConfig;
        const isCacheable = config.cache !== false;

        if (cacheable && isCacheable) {
          const key = this.getCacheKey(config);
          if (config.method === 'get') {
            // Pour une requête GET, stocker la réponse en cache
            Cache.set(key, response.data);
          } else {
            // Pour les requêtes POST, PUT ou DELETE, supprimer le cache associé
            Cache.del(this.getCacheKey(config, true));
          }
        }
        return response;
      },
      error: (error: any) => Promise.reject(error),
    };
  }

  public getCacheKey(config: CacheableAxiosRequestConfig, onlyRoot: boolean = false): string {
    let key = config.url || '';
    if (config.params && !onlyRoot) {
      key += `?${JSON.stringify(config.params)}`;
    }
    return key;
  }
}
