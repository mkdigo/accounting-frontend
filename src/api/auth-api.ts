import { Api } from './base/api';
import type { TResponse } from './base/request-interface';

export type TLoginInput = {
  username: string;
  password: string;
};

type TLoginResponse = {
  token: string;
};

export class AuthApi extends Api {
  public async login(input: TLoginInput): TResponse<TLoginResponse> {
    return this.request.post('/login', input);
  }

  public async me(): TResponse<TLoginResponse> {
    return this.request.get('/me');
  }

  public async logout(): TResponse<{ success: true }> {
    return this.request.get('/logout');
  }

  public async logoutAllDevices(): TResponse<{ success: true }> {
    return this.request.get('/logout-all-devices');
  }
}
