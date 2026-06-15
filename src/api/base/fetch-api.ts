import { Token } from '../../utils/token';
import { type RequestInterface, type TResponse } from './request-interface';

const BASE_URL = import.meta.env.VITE_API_URL;

type TMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class FetchRequest implements RequestInterface {
  private headers: Headers;
  private controller: AbortController;
  private url: string = '';
  private body: any = undefined;
  private method: TMethod = 'GET';

  constructor(headers?: Record<string, string>) {
    this.headers = headers ? new Headers(headers) : this.defaultHeaders();
    this.controller = new AbortController();
  }

  private defaultHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const token = Token.get();
    if (token) headers.append('Authorization', `Bearer ${token}`);
    return headers;
  }

  private async request(method: TMethod, url: string, body: any = undefined) {
    if (body instanceof FormData) {
      this.headers = new Headers({
        Authorization: `Bearer ${Token.get()}`,
      });
    } else {
      if (body) body = JSON.stringify(body);
    }

    if (method === 'GET' || method === 'DELETE')
      this.headers.delete('Content-Type');

    this.method = method;
    this.url = `${BASE_URL}${url}`;
    this.body = body;

    return await fetch(this.url, {
      method,
      headers: this.headers,
      credentials: 'include',
      signal: this.controller.signal,
      body,
    });
  }

  private async parseData(response: Response): TResponse<any> {
    const status = response.status;
    const data = await response.json();

    if (status === 200 || status === 201) {
      return {
        ok: true,
        status,
        data,
      };
    }

    if (status === 401 || status === 403) {
      Token.remove();

      if (data.message !== 'jwt expired') {
        return { ok: false, status, ...data };
      }

      const refreshTokenResponse = await fetch(`${BASE_URL}/tokens/refresh`, {
        method: 'GET',
        headers: this.headers,
        credentials: 'include',
        signal: this.controller.signal,
      });

      if (refreshTokenResponse.status === 200) {
        const refreshTokenData = await refreshTokenResponse.json();
        const newToken = refreshTokenData.token;
        Token.set(newToken);
        this.headers.set('Authorization', `Bearer ${newToken}`);

        const response = await fetch(this.url, {
          method: this.method,
          headers: this.headers,
          credentials: 'include',
          signal: this.controller.signal,
          body: this.body,
        });

        const status = response.status;
        const data = await response.json();
        if (status === 200 || status === 201) {
          return {
            ok: true,
            status,
            data,
          };
        }
        return {
          ok: false,
          status,
          ...data,
        };
      } else {
        window.location.reload();
      }
    }

    return { ok: false, status, ...data };
  }

  async get(url: string, params?: Record<string, string>): TResponse<any> {
    try {
      const urlParams: string = params
        ? new URLSearchParams(params).toString()
        : '';

      const response = await this.request('GET', `${url}?${urlParams}`);

      return this.parseData(response);
    } catch (e: any) {
      return {
        ok: false,
        status: 500,
        message: e.message,
        isAborted: e.name === 'AbortError' ? true : undefined,
      };
    }
  }

  async post(
    url: string,
    body?: Record<string, string | number>,
  ): TResponse<any> {
    try {
      const response = await this.request('POST', url, body);

      return this.parseData(response);
    } catch (e: any) {
      return {
        ok: false,
        status: 500,
        message: e.message,
      };
    }
  }

  async put(
    url: string,
    body?: Record<string, string | number>,
  ): TResponse<any> {
    try {
      const response = await this.request('PUT', url, body);

      return this.parseData(response);
    } catch (e: any) {
      return {
        ok: false,
        status: 500,
        message: e.message,
      };
    }
  }

  async patch(
    url: string,
    body?: Record<string, string | number>,
  ): TResponse<any> {
    try {
      const response = await this.request('PATCH', url, body);

      return this.parseData(response);
    } catch (e: any) {
      return {
        ok: false,
        status: 500,
        message: e.message,
      };
    }
  }

  async delete(url: string): TResponse<any> {
    try {
      const response = await this.request('DELETE', url);

      return this.parseData(response);
    } catch (e: any) {
      return {
        ok: false,
        status: 500,
        message: e.message,
      };
    }
  }

  abort() {
    this.controller.abort();
  }
}
