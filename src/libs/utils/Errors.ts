export class BaseError extends Error {
  public code: string;
  public data: any;

  constructor(
    code: string = 'ERR_OTHER',
    message: string = 'An error occurred...',
    data: any = null
  ) {
    super(message);
    this.code = code;
    this.data = data;

    // Enregistrer le nom de la classe dans la propriété 'name'
    this.name = this.constructor.name;
    // Éviter de diffuser la stack pour ces erreurs
    delete this.stack;
  }
}

export class DependencyError extends BaseError {
  public source: string;
  public dependents: any[];

  constructor(source: string, dependents: any[] = []) {
    super('ERR_DEPENDENCY', 'DELETE request not possible');
    this.source = source;
    this.dependents = dependents;
  }
}

export class ServerError extends BaseError {
  constructor(
    module: string,
    apiCall: string,
    err: unknown,
    params: Record<string, any> = {}
  ) {
    const data = {
      module,
      apiCall,
      params,
      err,
    };
    const message = `${module} - ${apiCall}\n\n${err?.toString()}`;
    super('ERR_SERVER', message, data);
  }
}
