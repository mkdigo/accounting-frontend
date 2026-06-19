import type { TTagName } from '../api/account-api';

type TTranslations = Record<TTagName, TTranslate>;

export class TagTranslations {
  static name(name: TTagName): TTranslate {
    const translations: TTranslations = {
      bank: {
        ptBR: 'Banco',
      },
      credit_card: {
        ptBR: 'Cartão de Crédito',
      },
      accounts_receivable: {
        ptBR: 'Contas a Receber',
      },
      accounts_payable: {
        ptBR: 'Contas a Pagar',
      },
    };
    return translations[name];
  }
}
