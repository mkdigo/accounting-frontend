import { Api } from './base/api';
import type { TResponse } from './base/request-interface';

export type TCompany = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type TCompanyCreateData = {
  name: string;
};

export type TCompanyUpdateData = TCompanyCreateData;

export class CompanyApi extends Api {
  public async listByUserId(): TResponse<{ companies: TCompany[] }> {
    return this.request.get('/companies');
  }

  public async findById(companyId: string): TResponse<{ company: TCompany }> {
    return this.request.get(`/companies/${companyId}`);
  }

  public async create(
    data: TCompanyCreateData,
  ): TResponse<{ company: TCompany }> {
    return this.request.post(`/companies`, data);
  }

  public async update(
    companyId: string,
    data: TCompanyUpdateData,
  ): TResponse<{ company: TCompany }> {
    return this.request.put(`/companies/${companyId}`, data);
  }

  public async delete(companyId: string): TResponse<void> {
    return this.request.delete(`/companies/${companyId}`);
  }
}
