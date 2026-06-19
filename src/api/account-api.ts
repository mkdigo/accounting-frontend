import { Api } from './base/api';
import type { TResponse } from './base/request-interface';

export const accountGroups = {
  assets: {
    subgroup: ['current_assets', 'non_current_assets'],
  },
  liabilities: {
    subgroup: ['current_liabilities', 'non_current_liabilities'],
  },
  equity: {
    subgroup: [],
  },
  income_statement_accounts: {
    subgroup: ['revenues', 'costs', 'expenses'],
  },
} as const;

export const accountSubgroups = {
  current_assets: {
    tags: ['bank', 'accounts_receivable'],
  },
  non_current_assets: {
    tags: ['accounts_receivable'],
  },
  current_liabilities: {
    tags: ['credit_card', 'accounts_payable'],
  },
  non_current_liabilities: {
    tags: ['accounts_payable'],
  },
  revenues: {
    tags: [],
  },
  costs: {
    tags: [],
  },
  expenses: {
    tags: [],
  },
} as const;

export type TAccountGroup = keyof typeof accountGroups;
export type TAccountSubgroup =
  | (typeof accountGroups.assets.subgroup)[number]
  | (typeof accountGroups.liabilities.subgroup)[number]
  | (typeof accountGroups.equity.subgroup)[number]
  | (typeof accountGroups.income_statement_accounts.subgroup)[number];
export type TTagName =
  | (typeof accountSubgroups.current_assets.tags)[number]
  | (typeof accountSubgroups.non_current_assets.tags)[number]
  | (typeof accountSubgroups.current_liabilities.tags)[number]
  | (typeof accountSubgroups.non_current_liabilities.tags)[number]
  | (typeof accountSubgroups.revenues.tags)[number]
  | (typeof accountSubgroups.costs.tags)[number]
  | (typeof accountSubgroups.expenses.tags)[number];

export type TAccount = {
  id: string;
  company_id: string;
  name: string;
  group: TAccountGroup;
  subgroup: TAccountSubgroup | null;
  tags: TTagName[];
};

export type TAccountCreateData = Omit<TAccount, 'id'>;
export type TAccountUpdateData = Omit<TAccount, 'id' | 'company_id' | 'tags'>;

export class AccountApi extends Api {
  async list(companyId: string): TResponse<{ accounts: TAccount[] }> {
    return this.request.get(`/companies/${companyId}/accounts`);
  }

  async create(data: TAccountCreateData): TResponse<{ account: TAccount }> {
    return this.request.post(`/companies/${data.company_id}/accounts`, data);
  }

  async update(
    id: string,
    data: TAccountUpdateData,
  ): TResponse<{ account: TAccount }> {
    return this.request.put(`/accounts/${id}`, data);
  }

  async delete(id: string): TResponse<{ account: TAccount }> {
    return this.request.delete(`/accounts/${id}`);
  }

  async addTag(
    id: string,
    data: { tagName: string },
  ): TResponse<{ account: TAccount }> {
    return this.request.patch(`/accounts/${id}/tags/add`, data);
  }

  async removeTag(
    id: string,
    data: { tagName: string },
  ): TResponse<{ account: TAccount }> {
    return this.request.patch(`/accounts/${id}/tags/remove`, data);
  }
}
