import {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'; // Importer AxiosInstance

interface InterceptorOptions {
  router: any;
  i18n: any;
  axiosInstance: AxiosInstance; // Ajouter l'instance Axios aux options
}

export class BaseInterceptor {
  private _requestInterceptor: number | null = null;
  private _responseInterceptor: number | null = null;
  protected $router: any;
  protected $i18n: any;
  protected axiosInstance: AxiosInstance; // Stocker l'instance Axios

  static registeredInterceptors: BaseInterceptor[] = [];

  constructor({ router, i18n, axiosInstance }: InterceptorOptions) {
    // Recevoir l'instance Axios
    this.$router = router;
    this.$i18n = i18n;
    this.axiosInstance = axiosInstance; // Assigner l'instance reçue
  }

  public getType(): string {
    return 'BaseInterceptor';
  }

  public requestInterceptor() {
    return {
      request: (
        config: InternalAxiosRequestConfig<any>
      ): InternalAxiosRequestConfig<any> => config,
      error: (error: any) => Promise.reject(error),
    };
  }

  public responseInterceptor() {
    return {
      response: (response: AxiosResponse): AxiosResponse => response,
      error: (error: any) => Promise.reject(error),
    };
  }

  public attachRequestInterceptor(): void {
    const { request, error } = this.requestInterceptor();
    // Utiliser l'instance Axios stockée
    this._requestInterceptor = this.axiosInstance.interceptors.request.use(
      request,
      error
    );
  }

  public attachResponseInterceptor(): void {
    const { response, error } = this.responseInterceptor();
    // Utiliser l'instance Axios stockée
    this._responseInterceptor = this.axiosInstance.interceptors.response.use(
      response,
      error
    );
  }

  public detachRequestInterceptor(): void {
    if (this._requestInterceptor !== null) {
      // Utiliser l'instance Axios stockée
      this.axiosInstance.interceptors.request.eject(this._requestInterceptor);
      this._requestInterceptor = null;
    }
  }

  public detachResponseInterceptor(): void {
    if (this._responseInterceptor !== null) {
      // Utiliser l'instance Axios stockée
      this.axiosInstance.interceptors.response.eject(this._responseInterceptor);
      this._responseInterceptor = null;
    }
  }

  public register(): void {
    this.attachRequestInterceptor();
    this.attachResponseInterceptor();
    (this.constructor as typeof BaseInterceptor).registeredInterceptors.push(
      this
    );
  }

  public getRegisteredInterceptors(): BaseInterceptor[] {
    return (this.constructor as typeof BaseInterceptor).registeredInterceptors;
  }
}
