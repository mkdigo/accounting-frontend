import type { TAccountGroup, TAccountSubgroup } from '../api/account-api';

type TGroupTranslations = Record<TAccountGroup, TTranslate>;
type TSubgroupTranslations = Record<TAccountSubgroup, TTranslate>;

export class AccountTranslations {
  static group(group: TAccountGroup): TTranslate {
    const translations: TGroupTranslations = {
      assets: {
        ptBR: 'Ativos',
      },
      liabilities: {
        ptBR: 'Passivos',
      },
      equity: {
        ptBR: 'Patrimônio Líquido',
      },
      income_statement_accounts: {
        ptBR: 'Contas de Resultado',
      },
    };
    return translations[group];
  }

  static subgroup(subgroup: TAccountSubgroup | null): TTranslate {
    if (!subgroup)
      return {
        ptBR: '',
      };
    const translations: TSubgroupTranslations = {
      current_assets: {
        ptBR: 'Ativo Circulante',
      },
      non_current_assets: {
        ptBR: 'Ativo não Circulante',
      },
      current_liabilities: {
        ptBR: 'Passivo Circulante',
      },
      non_current_liabilities: {
        ptBR: 'Passivo não Circulante',
      },
      revenues: {
        ptBR: 'Receitas',
      },
      costs: {
        ptBR: 'Custos',
      },
      expenses: {
        ptBR: 'Despesas',
      },
    };
    return translations[subgroup];
  }
}
