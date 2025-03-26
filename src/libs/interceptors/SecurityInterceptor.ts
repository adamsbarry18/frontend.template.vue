import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { BaseInterceptor } from './BaseInterceptor';
import { useRouter } from 'vue-router';
import RootNotification from '../utils/Notification';
import { useUsersStore } from '@/modules/users/store/user';

export class SecurityInterceptor extends BaseInterceptor {
  protected readonly $router = useRouter();

  /** Retourne le type de l'intercepteur */
  getType(): string {
    return 'SecurityInterceptor';
  }

  /** Configure l'intercepteur de requête */
  requestInterceptor() {
    return {
      request: (
        config: InternalAxiosRequestConfig
      ): InternalAxiosRequestConfig => {
        config = this.setRequestHeaders(config);
        config = this.setVersion(config);
        return config;
      },
      error: (error: AxiosError): Promise<never> =>
        Promise.reject(error) as Promise<never>,
    };
  }

  /** Configure l'intercepteur de réponse */
  responseInterceptor() {
    return {
      response: (response: AxiosResponse): AxiosResponse => response,
      error: async (error: AxiosError): Promise<never> => {
        const originalRequest = error.config;
        const errorResponse = error.response;
        if (!originalRequest || !errorResponse) {
          throw error;
        }
        if (!(originalRequest as any).skipAuthErrorInterceptor) {
          if (errorResponse.status === 401) {
            this.detachResponseInterceptor();
            try {
              const usersStore = useUsersStore();
              const result = await usersStore.relogin();
              if (!result) return null as never;
              this.attachResponseInterceptor();
              this.setRequestHeaders(originalRequest);
              this.setVersion(originalRequest);
              return await axios(originalRequest);
            } catch (err) {
              console.error('responseInterceptor', err);
              this.attachResponseInterceptor();
              await this.forceLogout();
              const query: { redirect?: string } = {};
              const route = this.$router.currentRoute.value;
              const skipRedirect = route?.meta?.authenticated === false;

              if (!skipRedirect) {
                if (route?.query?.redirect) {
                  query.redirect = route.query.redirect as string;
                } else {
                  query.redirect = `${location.pathname}${location.hash}`;
                }
              } else {
                console.info(
                  'Skip unauthenticated route redirect',
                  route?.name
                );
              }

              this.$router.push({ name: 'login', query });
              throw error;
            }
          } else if (errorResponse.status === 403) {
            const usersStore = useUsersStore();
            const errorData = errorResponse.data as any;
            if (errorData.data.code === 'ERR_PWD_EXPIRED') {
              const { email } = usersStore;
              await this.forceLogout();
              this.$router.push({ name: 'login.expired', params: { email } });
            } else {
              RootNotification.error({
                title: this.$i18n.t('notify.error'),
                message: this.$i18n.t('error.action-not-allowed'),
              });
            }
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
      if (!config.params.version) {
        config.params.version = 2;
      }
    }
    return config;
  }

  /** Configure les en-têtes de la requête */
  setRequestHeaders(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const usersStore = useUsersStore();
    const { language, token, securityToken } = usersStore;
    if (token) {
      config.headers['X-API-key'] = token;
    }
    if (securityToken?.access_token) {
      config.headers.Authorization = `Bearer ${securityToken.access_token}`;
    }
    config.headers['Content-type'] = 'application/json';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Accept-Language'] = language || 'en';
    return config;
  }

  /** Force la déconnexion de l'utilisateur */
  async forceLogout(): Promise<void> {
    const usersStore = useUsersStore();
    if (!usersStore.isLoggingOut) {
      try {
        console.error('Force logout');
        await usersStore.logout();
      } catch (error) {
        console.error(error);
      }
    }
  }
}
