import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

interface InterceptorOptions {
  router: any;
  i18n: any;
}

export class BaseInterceptor {
  private _requestInterceptor: number | null = null;
  private _responseInterceptor: number | null = null;
  protected $router: any;
  protected $i18n: any;

  static registeredInterceptors: BaseInterceptor[] = [];

  constructor({ router, i18n }: InterceptorOptions) {
    this.$router = router;
    this.$i18n = i18n;
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
    this._requestInterceptor = axios.interceptors.request.use(request, error);
  }

  public attachResponseInterceptor(): void {
    const { response, error } = this.responseInterceptor();
    this._responseInterceptor = axios.interceptors.response.use(
      response,
      error
    );
  }

  public detachRequestInterceptor(): void {
    if (this._requestInterceptor !== null) {
      axios.interceptors.request.eject(this._requestInterceptor);
      this._requestInterceptor = null;
    }
  }

  public detachResponseInterceptor(): void {
    if (this._responseInterceptor !== null) {
      axios.interceptors.response.eject(this._responseInterceptor);
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
