import { useEffect, useState } from 'react';

import { useAppContext } from '../../hooks/useAppContext';
import {
  BalanceSheetApi,
  type TBalanceSheet,
  type TIncomeStatement,
} from '../../api/BalanceSheetApi';
import { NumberHandler } from '../../utils/NumberHandler';

import { Layout } from '../../Layout';
import { PrintButton } from '../../components/Buttons/PrintButton';
import { Input } from '../../components/Form/Input';
import { Select } from '../../components/Form/Select';

import styles from './styles.module.css';

interface IYearMonth {
  year: string;
  month: string;
}

const BalanceSheet: React.FC = () => {
  const { loader, currentCompany } = useAppContext();
  const today = new Date();
  const thisYear = String(today.getFullYear());
  const thisMonth =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : String(today.getMonth() + 1);

  const [yearMonth, setYearMonth] = useState<IYearMonth>({
    year: thisYear,
    month: thisMonth,
  });

  const [balanceSheet, setBalanceSheet] = useState<TBalanceSheet>({
    assets: {
      currentAssets: [],
      nonCurrentAssets: [],
    },
    liabilities: {
      currentLiabilities: [],
      nonCurrentLiabilities: [],
    },
    equity: [],
    amounts: {
      assets: 0,
      currentAssets: 0,
      nonCurrentAssets: 0,
      currentLiabilities: 0,
      nonCurrentLiabilities: 0,
      equity: 0,
      liabilities: 0,
      retainedEarnings: 0,
    },
  });

  const [incomeStatement, setIncomeStatement] = useState<TIncomeStatement>({
    revenues: [],
    costs: [],
    expenses: [],
    taxes: [],
    amounts: {
      revenues: 0,
      costs: 0,
      expenses: 0,
      taxes: 0,
      incomeBeforeTaxes: 0,
      incomeAfterTaxes: 0,
    },
  });

  useEffect(() => {
    if (!currentCompany) return;
    loader(async () => {
      const api = new BalanceSheetApi();

      const response = await api.report({
        companyId: currentCompany.id,
        year: yearMonth.year,
        month: yearMonth.month,
      });

      if (!response.ok) return;

      setBalanceSheet(response.data.balanceSheet);
      setIncomeStatement(response.data.incomeStatement);
    });
  }, [currentCompany, yearMonth]);

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    let value: string | number = event.target.value;

    setYearMonth((prev) => ({
      ...prev,
      [event.target.name]: value,
    }));
  };

  return (
    <Layout.Root>
      <Layout.Title text='Balanço Patrimonial'>
        <PrintButton size='medium' />
      </Layout.Title>

      <ul className={styles.selectDate}>
        <li>
          <Input
            type='number'
            label='Ano'
            name='year'
            value={yearMonth.year}
            onChange={handleInputChange}
          />
        </li>
        <li>
          <Select
            label='Mês'
            name='month'
            value={yearMonth.month}
            onChange={handleInputChange}
          >
            <option value='01'>1</option>
            <option value='02'>2</option>
            <option value='03'>3</option>
            <option value='04'>4</option>
            <option value='05'>5</option>
            <option value='06'>6</option>
            <option value='07'>7</option>
            <option value='08'>8</option>
            <option value='09'>9</option>
            <option value='10'>10</option>
            <option value='11'>11</option>
            <option value='12'>12</option>
          </Select>
        </li>
      </ul>

      <section className={styles.balance}>
        <div className={styles.assets}>
          <div>
            <h2>Ativo</h2>

            <ul>
              <li>
                <strong>Circulante</strong>
                <strong>
                  {NumberHandler.currency(balanceSheet.amounts.currentAssets)}
                </strong>
              </li>
              {balanceSheet.assets.currentAssets.map((item, i) => (
                <li key={`currentAssets_${i}`}>
                  <span>{item.name}</span>
                  <span>{NumberHandler.currency(item.value)}</span>
                </li>
              ))}
            </ul>

            <ul>
              <li>
                <strong>Não Circulante</strong>
                <strong>
                  {NumberHandler.currency(
                    balanceSheet.amounts.nonCurrentAssets,
                  )}
                </strong>
              </li>
              {balanceSheet.assets.nonCurrentAssets.map((item, i) => (
                <li key={`nonCurrentAssets_${i}`}>
                  <span>{item.name}</span>
                  <span>{NumberHandler.currency(item.value)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className='amount'>
            <ul>
              <li>
                <strong>Total</strong>
                <strong>
                  {NumberHandler.currency(balanceSheet.amounts.assets)}
                </strong>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div>
            <h2>Passivo</h2>

            <ul>
              <li>
                <strong>Circulante</strong>
                <strong>
                  {NumberHandler.currency(
                    balanceSheet.amounts.currentLiabilities,
                  )}
                </strong>
              </li>
              {balanceSheet.liabilities.currentLiabilities.map((item, i) => (
                <li key={`currentLiabilities_${i}`}>
                  <span>{item.name}</span>
                  <span>{NumberHandler.currency(item.value)}</span>
                </li>
              ))}
            </ul>

            <ul>
              <li>
                <strong>Não Circulante</strong>
                <strong>
                  {NumberHandler.currency(
                    balanceSheet.amounts.nonCurrentLiabilities,
                  )}
                </strong>
              </li>
              {balanceSheet.liabilities.nonCurrentLiabilities.map((item, i) => (
                <li key={`nonCurrentLiabilities_${i}`}>
                  <span>{item.name}</span>
                  <span>{NumberHandler.currency(item.value)}</span>
                </li>
              ))}
            </ul>

            <ul>
              <li>
                <strong>Patrimônio Líquido</strong>
                <strong>
                  {NumberHandler.currency(balanceSheet.amounts.equity)}
                </strong>
              </li>
              {balanceSheet.equity.map((item, i) => (
                <li key={`equity_${i}`}>
                  <span>{item.name}</span>
                  <span>{NumberHandler.currency(item.value)}</span>
                </li>
              ))}
              <li>
                <span>Lucros Acumulados</span>
                <span
                  className={
                    balanceSheet.amounts.retainedEarnings < 0
                      ? styles.isNegative
                      : ''
                  }
                >
                  {NumberHandler.currency(
                    balanceSheet.amounts.retainedEarnings,
                  )}
                </span>
              </li>
            </ul>
          </div>
          <div className='amount'>
            <ul>
              <li>
                <strong>Total</strong>
                <strong>
                  {NumberHandler.currency(balanceSheet.amounts.liabilities)}
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Layout.Title text='DRE' className={styles.incomeStatementTitle} />

      <section className={styles.incomeStatement}>
        <ul>
          <h2>Receitas</h2>

          {incomeStatement.revenues.map((item, i) => (
            <li key={`revenues_${i}`}>
              <span>{item.name}</span>
              <span>{NumberHandler.currency(item.value)}</span>
            </li>
          ))}
          <li>
            <strong>Total das Receitas</strong>
            <strong>
              {NumberHandler.currency(incomeStatement.amounts.revenues)}
            </strong>
          </li>
        </ul>

        <ul>
          <h2>Custos</h2>

          {incomeStatement.costs.map((item, i) => (
            <li key={`costs_${i}`}>
              <span>{item.name}</span>
              <span>{NumberHandler.currency(item.value)}</span>
            </li>
          ))}
          <li>
            <strong>Total dos Custos</strong>
            <strong>
              {NumberHandler.currency(incomeStatement.amounts.costs)}
            </strong>
          </li>
          <li>
            <strong>Receita Líquida</strong>
            <strong>
              {NumberHandler.currency(
                incomeStatement.amounts.revenues -
                  incomeStatement.amounts.costs,
              )}
            </strong>
          </li>
        </ul>

        <ul>
          <h2>Despesas</h2>

          {incomeStatement.expenses.map((item, i) => (
            <li key={`expenses_${i}`}>
              <span>{item.name}</span>
              <span>{NumberHandler.currency(item.value)}</span>
            </li>
          ))}
          <li>
            <strong>Total das Despesas</strong>
            <strong>
              {NumberHandler.currency(incomeStatement.amounts.expenses)}
            </strong>
          </li>
          <li>
            <strong>Lucro/Prejuizo antes dos impostos</strong>
            <strong
              className={
                incomeStatement.amounts.incomeBeforeTaxes < 0
                  ? styles.isNegative
                  : ''
              }
            >
              {NumberHandler.currency(
                incomeStatement.amounts.incomeBeforeTaxes,
              )}
            </strong>
          </li>
          {incomeStatement.taxes.map((item, i) => (
            <li key={`taxes_${i}`}>
              <span>{item.name}</span>
              <span>{NumberHandler.currency(item.value)}</span>
            </li>
          ))}
          <li className='netIncome'>
            <strong>Lucro/Prejuizo depois dos impostos</strong>
            <strong
              className={
                incomeStatement.amounts.incomeAfterTaxes < 0
                  ? styles.isNegative
                  : ''
              }
            >
              {NumberHandler.currency(incomeStatement.amounts.incomeAfterTaxes)}
            </strong>
          </li>
        </ul>
      </section>
    </Layout.Root>
  );
};

export { BalanceSheet };
