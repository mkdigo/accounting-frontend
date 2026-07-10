import { useEffect, useRef, useState } from 'react';
import Decimal from 'decimal.js';

import {
  EntryApi,
  type TEntry,
  type TEntrySearchParams,
} from '../../api/entry-api';
import { AccountApi, type TAccount } from '../../api/account-api';
import { useAppContext } from '../../hooks/useAppContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { NumberHandler } from '../../utils/NumberHandler';

import { Layout } from '../../Layout';
import { Table } from '../Table';
import { Modal } from '../Modal';
import { Form } from '../Form';
import { Input } from '../Form/Input';
import { TrashButton } from '../Buttons/TrashButton';
import { EntryForm } from '../EntryForm';

import styles from './styles.module.css';

type Props = {
  account: TAccount;
  entries: TEntry[];
  setEntries: React.Dispatch<React.SetStateAction<TEntry[]>>;
  debitAccounts: TAccount[];
  creditAccounts: TAccount[];
  filterData: TEntrySearchParams;
  setFilterData: React.Dispatch<React.SetStateAction<TEntrySearchParams>>;
};

export function AccountEntriesList({
  account,
  entries,
  setEntries,
  debitAccounts,
  creditAccounts,
  filterData,
  setFilterData,
}: Props) {
  const { handleOpenModal, loader, handleNotify, handleCloseModal } =
    useAppContext();
  const { currentCompany } = useAuthContext();
  const [selectedEntry, setSelectedEntry] = useState<TEntry>();
  const [entriesLastId, setEntriesLastId] = useState<string>();
  const [accountBalance, setAccountBalance] = useState(new Decimal(0));
  const lastEntryRef = useRef<HTMLTableRowElement>(null);
  let balance = accountBalance;

  // Get Account Balance
  useEffect(() => {
    const api = new AccountApi();
    api
      .getBalance({
        accountId: account.id,
        end: filterData.end,
      })
      .then((response) => {
        if (!response.ok) return;
        setAccountBalance(new Decimal(response.data.value));
      });

    return () => {
      api.abort();
    };
  }, [account.id, filterData.end, entries]);

  async function getEntries(lastId?: string) {
    if (!currentCompany || filterData.accountId === 'none') return;
    loader(async () => {
      const api = new EntryApi();
      let params: TEntrySearchParams = { ...filterData };
      if (lastId) params.lastId = lastId;
      const response = await api.list(currentCompany.id, params);

      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: 'Não foi possivel filtrar os lançamentos, tente novamente.',
        });
        return;
      }

      const entries = response.data.entries;

      if (entries.length > 0) setEntriesLastId(entries[entries.length - 1].id);
      if (lastId) setEntries((prev) => [...prev, ...entries]);
      else setEntries(entries);
    });
  }

  // Get Entries
  useEffect(() => {
    if (!currentCompany) return;
    getEntries();
  }, [currentCompany, filterData.accountId]);

  // Infine Scroll
  useEffect(() => {
    if (!lastEntryRef.current) return;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            getEntries(entriesLastId);
            observer.unobserve(lastEntryRef.current!);
          }
        });
      },
      {
        scrollMargin: '300px',
      },
    );

    observer.observe(lastEntryRef.current);

    return () => {
      observer.disconnect();
    };
  }, [lastEntryRef.current]);

  function handleFilterInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setFilterData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSearchSubmit(): void {
    getEntries();
  }

  function handleEditModal(entry: TEntry): void {
    handleOpenModal('edit');
    setSelectedEntry(entry);
  }

  function handleDeleteModal(): void {
    handleOpenModal('delete');
  }

  async function handleDeleteSubmit(event: React.SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!selectedEntry) return;

    loader(async () => {
      const api = new EntryApi();

      const response = await api.delete(selectedEntry.id);

      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: 'Não foi possivel excluir o lançamento, tente novamente.',
        });
        return;
      }

      const newEntries = entries.filter(
        (entry) => entry.id !== selectedEntry.id,
      );
      setEntries(newEntries);
      handleCloseModal();
      handleNotify({
        type: 'success',
        message: 'Lançamento excluido com sucesso!',
      });
    });
  }

  function getName(entry: TEntry): string {
    return entry.debit_id === account.id ? entry.credit_name : entry.debit_name;
  }

  function getAction(entry: TEntry): 'plus' | 'sub' {
    return (account.group === 'assets' ||
      account.subgroup === 'expenses' ||
      account.subgroup === 'costs') &&
      entry.credit_id === account.id
      ? 'sub'
      : (account.group === 'liabilities' ||
            account.group === 'equity' ||
            account.subgroup === 'revenues') &&
          entry.debit_id === account.id
        ? 'sub'
        : 'plus';
  }

  function handleBalanceCalculate(entry: TEntry): string {
    if (balance.toNumber() === 0) return '';
    const action = getAction(entry);
    const currentBalance = NumberHandler.currency(balance.toNumber());
    const value = new Decimal(entry.value);
    if (action === 'sub') balance = balance.plus(value);
    else balance = balance.sub(value);
    return currentBalance;
  }
  return (
    <>
      <Layout.Filter onSubmit={handleSearchSubmit}>
        <Input
          label='Início'
          type='date'
          name='start'
          value={filterData.start}
          onChange={handleFilterInputChange}
        />
        <Input
          label='Fim'
          type='date'
          name='end'
          value={filterData.end}
          onChange={handleFilterInputChange}
        />
        <Input
          label='Busca'
          type='search'
          name='search'
          value={filterData.search}
          onChange={handleFilterInputChange}
        />
      </Layout.Filter>

      <section>
        <Table.Root
          className={styles.table}
          head={['Data', 'Conta', 'Valor', 'Saldo']}
        >
          {entries.map((entry, i) => (
            <Table.Row
              key={entry.id}
              ref={i + 1 === entries.length ? lastEntryRef : undefined}
              onClick={() => handleEditModal(entry)}
            >
              <Table.Column>{entry.inclusion}</Table.Column>
              <Table.Column textAlign='left'>{getName(entry)}</Table.Column>
              <Table.Column textAlign='right'>
                {getAction(entry) === 'sub' ? '-' : ''}
                {NumberHandler.currency(entry.value)}
              </Table.Column>
              <Table.Column textAlign='right'>
                {handleBalanceCalculate(entry)}
              </Table.Column>
            </Table.Row>
          ))}
        </Table.Root>
      </section>
      <Modal name='edit' title='Editar Lançamento'>
        <EntryForm
          debitAccounts={debitAccounts}
          creditAccounts={creditAccounts}
          entry={selectedEntry}
          setEntries={setEntries}
        />
        <TrashButton
          className={styles.trashButton}
          color='link'
          textColor='danger'
          onClick={handleDeleteModal}
        >
          Exclui
        </TrashButton>
      </Modal>

      <Modal name='delete' title='Excluir Lançamento'>
        <Form
          onSubmit={handleDeleteSubmit}
          cancelButtonAction='closeModal'
          cancelButtonText='Não'
          submitButtonText='Sim'
        >
          <span>Tem certeza que deseja excluir?</span>
        </Form>
      </Modal>
    </>
  );
}
