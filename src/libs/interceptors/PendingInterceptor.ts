import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseInterceptor } from './BaseInterceptor';

const cacheable = true;

interface PendingCallbacks {
  _fn: Array<(err: any, data?: any) => void>;
  add: (fn: (err: any, data?: any) => void) => void;
  resolve: (data: any) => void;
  reject: (err: any) => void;
}

const Cache = {
  _items: {} as Record<string, PendingCallbacks | any>,
  get(key: string): PendingCallbacks | any {
    return this._items[key];
  },
  set(key: string, value: any): void {
    this._items[key] = value;
  },
  del(key: string): void {
    this._items[key] = null;
  },
};

export class PendingInterceptor extends BaseInterceptor {
  public override getType(): string {
    return 'PendingInterceptor';
  }

  public override requestInterceptor() {
    const interceptor = {
      request: (
        request: InternalAxiosRequestConfig<any>
      ):
        | InternalAxiosRequestConfig<any>
        | Promise<InternalAxiosRequestConfig<any>> => {
        // Ne traiter que les requêtes GET et si le cache est activé
        if (request.method === 'get' && cacheable) {
          const key = this.getCacheKey(request);
          const _pending = Cache.get(key) as PendingCallbacks | undefined;

          if (_pending) {
            // Une requête identique est déjà en cours, on renvoie une promesse qui s'adaptera
            return new Promise((resolve, reject) => {
              _pending.add((err, data) => {
                if (err) return reject(err);
                // Affecte la donnée mise en cache à request.data
                request.data = data;
                // On définit l'adapter pour renvoyer directement la réponse en cache sans exécuter la requête
                request.adapter = () =>
                  Promise.resolve({
                    data,
                    status: 200,
                    statusText: 'OK',
                    headers: request.headers,
                    config: request,
                    request,
                  } as AxiosResponse);
                return resolve(request);
              });
            });
          }

          // Aucun cache n'existe encore pour cette clé, on crée une "file d'attente"
          Cache.set(key, {
            _fn: [] as Array<(err: any, data?: any) => void>,
            add(fn: (err: any, data?: any) => void) {
              this._fn.push(fn);
            },
            resolve(data: any) {
              this._fn.forEach((fn) =>
                fn(null, JSON.parse(JSON.stringify(data)))
              );
            },
            reject(err: any) {
              this._fn.forEach((fn) => fn(err));
            },
          } as PendingCallbacks);
        }
        return request;
      },
      error: (error: any): Promise<never> => Promise.reject(error),
    };
    return interceptor as {
      request: (
        config: InternalAxiosRequestConfig<any>
      ) => InternalAxiosRequestConfig<any>;
      error: (error: any) => Promise<never>;
    };
  }

  public override responseInterceptor() {
    return {
      response: (response: AxiosResponse): AxiosResponse => {
        if (cacheable) {
          const key = this.getCacheKey(response.config);
          if (response.config.method === 'get') {
            // Pour les requêtes GET, on résout la file d'attente avec les données reçues
            const pending = Cache.get(key) as PendingCallbacks | null;
            if (pending) {
              pending.resolve(response.data);
              Cache.del(key);
            }
          }
        }
        return response;
      },
      error: (error: any) => {
        if (cacheable && error?.config) {
          const key = this.getCacheKey(error.config);
          if (error.config.method === 'get') {
            const pending = Cache.get(key) as PendingCallbacks | null;
            if (pending) {
              pending.resolve(error.response?.data);
              Cache.del(key);
            }
          }
        }
        return Promise.reject(error);
      },
    };
  }

  public getCacheKey(
    config: InternalAxiosRequestConfig<any>,
    onlyRoot: boolean = false
  ): string {
    let key = config.url || '';
    if (config.params && !onlyRoot) {
      key += `?${JSON.stringify(config.params)}`;
    }
    return key;
  }
}
