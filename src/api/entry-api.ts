import { DateTime } from '@mkdigo/datetime';
import { Api } from './base/api';
import type { TResponse } from './base/request-interface';
import type { TAccountSubgroup } from './account-api';

export type TEntryData = {
  id?: string;
  inclusion: string;
  debitId: string;
  creditId: string;
  value: number;
  note: string;
};

export type TEntry = {
  id: string;
  inclusion: string;
  debit_id: string;
  debit_name: string;
  credit_id: string;
  credit_name: string;
  value: number;
  note: string;
};

export type TEntrySearchParams = {
  accountId?: string;
  start: string;
  end: string;
  search: string;
  lastId?: string;
  subgroup?: TAccountSubgroup;
};

export class EntryApi extends Api {
  public async list(
    companyId: string,
    params: TEntrySearchParams,
  ): Promise<TResponse<{ entries: TEntry[] }>> {
    return this.request.get(`/companies/${companyId}/entries`, {
      ...params,
      start: DateTime.localeDateToUTC(params.start),
      end: DateTime.localeDateToUTC(params.end),
    });
  }

  public async create(
    companyId: string,
    data: TEntryData,
  ): Promise<TResponse<{ entry: TEntry }>> {
    return this.request.post(`/companies/${companyId}/entries`, {
      ...data,
    });
  }

  public async update(data: TEntryData): Promise<TResponse<{ entry: TEntry }>> {
    return this.request.put(`/entries/${data.id}`, {
      ...data,
    });
  }

  public async delete(id: string): Promise<TResponse<void>> {
    return this.request.delete(`/entries/${id}`);
  }
}
