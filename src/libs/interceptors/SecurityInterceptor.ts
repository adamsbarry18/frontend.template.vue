import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import router from '@/router';
import i18n from '@/i18n';
import { BaseInterceptor } from './BaseInterceptor';
import { storageService } from '../utils/StorageService';
import RootNotification from '../utils/Notification';
import { useUsersStore } from '@/stores/modules/users/user';

export class SecurityInterceptor extends BaseInterceptor {
  /** Retourne le type de l'intercepteur */
  override getType(): string {
    return 'SecurityInterceptor';
  }

  /** Configure l'intercepteur de requête */
  override requestInterceptor() {
    return {
      request: (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        config = this.setRequestHeaders(config);
        config = this.setVersion(config);
        return config;
      },
      error: (error: AxiosError): Promise<never> => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      },
    };
  }

  /** Configure l'intercepteur de réponse */
  override responseInterceptor() {
    return {
      response: (response: AxiosResponse): AxiosResponse => response,
      error: async (error: AxiosError): Promise<never> => {
        const originalRequest = error.config;
        const errorResponse = error.response;

        const usersStore = useUsersStore();

        if (!originalRequest || !errorResponse) {
          console.error('Interceptor error without originalRequest or errorResponse', error);
          throw error;
        }

        if ((originalRequest as any).skipAuthErrorInterceptor) {
          // --- Gestion 401 Unauthorized ---
          if (errorResponse.status === 401) {
            console.warn('Received 401 Unauthorized. Attempting relogin...');
            if (!(originalRequest as any)._retry) {
              (originalRequest as any)._retry = true;
              this.detachResponseInterceptor();
              try {
                const user = await usersStore.fetchCurrentUser();
                if (!user) {
                  console.warn('fetchCurrentUser failed after 401.');
                  throw new Error('Relogin failed');
                }

                console.log('Relogin successful. Retrying original request...');
                this.attachResponseInterceptor();
                this.setVersion(originalRequest);
                this.setRequestHeaders(originalRequest);
                return await axios(originalRequest);
              } catch (reloginError) {
                console.error('Relogin attempt failed:', reloginError);
                this.attachResponseInterceptor();
                const usersStore = useUsersStore();
                if (usersStore.isAuthenticated) {
                  console.warn('Relogin failed, but user is currently authenticated. Skipping force logout.');
                  throw error;
                } else {
                  console.warn('Relogin failed and user is not authenticated. Forcing logout.');
                  await this.forceLogout();

                  const query: { redirect?: string } = {};
                  const currentRoute = router.currentRoute.value;
                  const skipRedirect = currentRoute?.meta?.authenticated === false;

                  if (!skipRedirect) {
                    query.redirect = currentRoute.fullPath;
                    console.log(`Redirecting to login with redirect query: ${query.redirect}`);
                  } else {
                    console.info(
                      `Skipping redirect for unauthenticated route: ${String(currentRoute?.name)}`
                    );
                  }
                  await router.push({ name: 'login', query });
                  throw error;
                }
              }
            } else {
              console.warn('Relogin already attempted for this request. Forcing logout.');
              await this.forceLogout();
              router.push({ name: 'login' }).catch((navError) => {
                console.error('Failed to redirect to login after repeated 401:', navError);
              });
              throw error;
            }
          }
          // --- Gestion 403 Forbidden ---
          else if (errorResponse.status === 403) {
            console.warn('Received 403 Forbidden.');
            const errorData = errorResponse.data as any;

            if (errorData?.data?.code === 'ERR_PWD_EXPIRED') {
              console.warn('Password expired (ERR_PWD_EXPIRED). Forcing logout and redirecting...');
              const userEmail = usersStore.email;
              await this.forceLogout();
              router
                .push({
                  name: 'login-expired',
                  params: { email: userEmail ?? '' },
                })
                .catch((navError) => {
                  console.error('Failed to redirect to login-expired:', navError);
                });
            } else {
              console.warn('Generic 403 error. Displaying notification.');
              RootNotification.error({
                title: i18n.global.t('notification.errorTitle', 'Error'),
                message: i18n.global.t('error.actionNotAllowed', 'Action not allowed'),
              });
            }
            throw error;
          }
        }
        throw error;
      },
    };
  }

  /** Définit la version dans les paramètres de la requête */
  setVersion(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    if (config && !(config as any).skipVersion) {
      if (!config.params) {
        config.params = {};
      }
      if (config.params && !config.params.version) {
        config.params.version = 2;
      }
    }
    return config;
  }

  /** Configure les en-têtes de la requête */
  setRequestHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const usersStore = useUsersStore();
    const language = usersStore.language;

    const token = storageService.getAuthToken();

    config.headers = config.headers ?? new axios.AxiosHeaders();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['Content-Type'] = 'application/json';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Accept-Language'] = language;

    return config;
  }

  /** Force la déconnexion de l'utilisateur */
  async forceLogout(): Promise<void> {
    const usersStore = useUsersStore();
    try {
      console.warn('SecurityInterceptor: Forcing logout...');

      await usersStore.logout();
    } catch (error) {
      console.error('SecurityInterceptor: Error during force logout:', error);
    }
  }
}
