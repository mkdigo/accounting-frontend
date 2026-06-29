import { Api } from './base/api';
import type { TResponse } from './base/request-interface';

type TData = {
  name: string;
  value: number;
}[];

export type TBalanceSheet = {
  assets: {
    currentAssets: TData;
    nonCurrentAssets: TData;
  };
  liabilities: {
    currentLiabilities: TData;
    nonCurrentLiabilities: TData;
  };
  equity: TData;
  amounts: {
    assets: number;
    currentAssets: number;
    nonCurrentAssets: number;
    liabilities: number;
    currentLiabilities: number;
    nonCurrentLiabilities: number;
    equity: number;
    retainedEarnings: number;
  };
};

export type TIncomeStatement = {
  revenues: TData;
  costs: TData;
  expenses: TData;
  taxes: TData;
  amounts: {
    revenues: number;
    costs: number;
    expenses: number;
    taxes: number;
    incomeBeforeTaxes: number;
    incomeAfterTaxes: number;
  };
};

type TParams = {
  companyId: string;
  year: string;
  month: string;
};

export class BalanceSheetApi extends Api {
  public async report(params: TParams): Promise<
    TResponse<{
      balanceSheet: TBalanceSheet;
      incomeStatement: TIncomeStatement;
    }>
  > {
    return await this.request.get(
      `/companies/${params.companyId}/balance`,
      params,
    );
  }
}
