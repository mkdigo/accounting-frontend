import { Api } from './base/api';
import type { TResponse } from './base/request-interface';

export type TUser = {
  id: string;
  name: string;
  email: string;
  cellphone: string;
  zipcode: string;
  state: string;
  city: string;
  district: string;
  address: string;
  username: string;
  created_at: string;
  updated_at: string;
};

export type TUserCreateData = {
  name: string;
  email: string;
  cellphone: string;
  zipcode: string;
  state: string;
  city: string;
  district: string;
  address: string;
  username: string;
  password: string;
  password_confirmation: string;
};

export type TUserUpdateData = Omit<TUserCreateData, 'email' | 'password'>;

export type TPasswordReset = {
  password: string;
  password_confirmation: string;
};

export type TVerificationCodeData = {
  email: string;
  code: string;
};

export class UserApi extends Api {
  public async create(data: TUserCreateData): TResponse<TUser> {
    return this.request.post('/users', data);
  }

  public async update(userId: string, data: TUserUpdateData): TResponse<TUser> {
    return this.request.put(`/users/${userId}`, data);
  }

  public async delete(userId: string): TResponse<void> {
    return this.request.delete(`/users/${userId}`);
  }

  public async emailVerifyCode(data: { email: string }): TResponse<void> {
    return this.request.post('/codes/email-verify', data);
  }

  public async emailVerify(
    data: TVerificationCodeData,
  ): TResponse<{ token: string }> {
    return this.request.post('/users/email-verify', data);
  }

  public async passwordResetCode(data: { email: string }): TResponse<void> {
    return this.request.post('/codes/password-reset', data);
  }

  public async passwordResetToken(data: {
    email: string;
    code: string;
  }): TResponse<{ token: string }> {
    return this.request.post('/tokens/password-reset', data);
  }

  public async passwordReset(data: TPasswordReset): TResponse<void> {
    return this.request.post('/users/password-reset', data);
  }
}
