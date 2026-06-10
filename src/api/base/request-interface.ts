export type TSuccessStatusCode = 200 | 201;
export type TErrorStatusCode = 400 | 401 | 403 | 404 | 422 | 500;
export type TError = {
  message: string;
  errors: Record<string, string[]>;
};

export type TResponseOk<T> = {
  ok: true;
  status: TSuccessStatusCode;
  data: T;
};

export type TResponseError = {
  ok: false;
  status: TErrorStatusCode;
  message: string;
  errors?: Record<string, string[]>;
};

export type TResponse<T> = Promise<TResponseOk<T> | TResponseError>;

export interface RequestInterface {
  get: (url: string, params?: Record<string, string>) => TResponse<any>;
  post: (url: string, body?: any) => TResponse<any>;
  put: (url: string, body?: any) => TResponse<any>;
  patch: (url: string, body?: any) => TResponse<any>;
  delete: (url: string) => TResponse<any>;
  abort: () => void;
}
