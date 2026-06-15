import { FetchRequest } from './fetch-api';
import {
  type RequestInterface,
  type TError,
  type TErrorStatusCode,
  type TResponseError,
  type TResponseOk,
  type TSuccessStatusCode,
} from './request-interface';

export class Api {
  protected request: RequestInterface;

  constructor() {
    this.request = new FetchRequest();
  }

  public abort() {
    this.request.abort();
  }

  protected responseResource(
    data: any,
    status: TSuccessStatusCode = 200,
  ): TResponseOk<any> {
    return {
      ok: true,
      status,
      data: data,
    };
  }

  protected failResource(
    error: TError,
    status: TErrorStatusCode = 500,
  ): TResponseError {
    return {
      ok: false,
      status,
      message: error.message,
      errors: error.errors,
    };
  }
}
