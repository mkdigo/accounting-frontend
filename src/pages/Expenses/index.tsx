import { useEffect, useRef, useState } from 'react';
import { DateTime } from '@mkdigo/datetime';

import { type TAccount } from '../../api/account-api';
import {
  EntryApi,
  type TEntry,
  type TEntrySearchParams,
} from '../../api/entry-api';
import { NumberHandler } from '../../utils/NumberHandler';

import { Layout } from '../../Layout';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Form/Input';
import { Card } from '../../components/Card';
import { PlusButton } from '../../components/Buttons/PlusButton';
import { PencilButton } from '../../components/Buttons/PencilButton';
import { TrashButton } from '../../components/Buttons/TrashButton';
import { Form } from '../../components/Form';
import { EntryForm } from '../../components/EntryForm';

import { useAppContext } from '../../hooks/useAppContext';
import { useAuthContext } from '../../hooks/useAuthContext';

const dateTime = new DateTime();
dateTime.subtractMonth(6);
dateTime.setDay(1);

export function Expenses() {
  const { loader, handleNotify, handleCloseModal, handleOpenModal } =
    useAppContext();
  const { currentCompany, accounts } = useAuthContext();
  const [debitAccounts, setDebitAccounts] = useState<TAccount[]>([]);
  const [creditAccounts, setCreditAccounts] = useState<TAccount[]>([]);
  const [entries, setEntries] = useState<TEntry[]>([]);
  const [filterData, setFilterData] = useState<TEntrySearchParams>({
    search: '',
    start: dateTime.getDate(),
    end: dateTime.getToday(),
    subgroup: 'expenses',
  });
  const [editEntry, setEditEntry] = useState<TEntry>({
    id: '',
    credit_id: '',
    credit_name: '',
    debit_id: '',
    debit_name: '',
    inclusion: '',
    note: '',
    value: 0,
  });
  const [deleteEntryId, setDeleteEntryId] = useState<string>('');
  const [entriesLastId, setEntriesLastId] = useState<string>();
  const lastEntryRef = useRef<HTMLDivElement>(null);

  // Accounts filter
  useEffect(() => {
    const debits = accounts.filter(
      (account) =>
        account.subgroup === 'costs' || account.subgroup === 'expenses',
    );
    setDebitAccounts(debits);

    const credits = accounts.filter(
      (account) => account.subgroup === 'current_assets',
    );
    setCreditAccounts(credits);
  }, [accounts]);

  async function getEntries(lastId?: string) {
    if (!currentCompany) return;
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
    const api = new EntryApi();
    (async () => {
      let params: TEntrySearchParams = { ...filterData };
      const response = await api.list(currentCompany.id, params);
      if (!response.ok) return;
      const entries = response.data.entries;
      setEntries(entries);
      if (entries.length > 0) setEntriesLastId(entries[entries.length - 1].id);
    })();
  }, [currentCompany]);

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
    setEditEntry(entry);
  }

  function handleDeleteModal(id: string): void {
    handleOpenModal('delete');
    setDeleteEntryId(id);
  }

  function handleDeleteSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    loader(async () => {
      const api = new EntryApi();
      const response = await api.delete(deleteEntryId);

      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: response.message,
        });
        return;
      }

      const newEntries = entries.filter((entry) => entry.id !== deleteEntryId);
      setEntries(newEntries);
      handleCloseModal();
      handleNotify({
        type: 'success',
        message: 'Lançamento excluido com sucesso!',
      });
    });
  }

  return (
    <Layout.Root>
      <Layout.Title text='Despesas'>
        <PlusButton onClick={() => handleOpenModal('add')} size='medium' />
      </Layout.Title>

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
        {entries.map((entry, i) => (
          <Card.Root
            key={entry.id}
            ref={i + 1 === entries.length ? lastEntryRef : undefined}
          >
            <Card.Table.Root>
              <Card.Table.Row label='Data' content={entry.inclusion} />
              <Card.Table.Row label='Débito' content={entry.debit_name} />
              <Card.Table.Row label='Crédito' content={entry.credit_name} />
              <Card.Table.Row
                label='Valor'
                content={NumberHandler.currency(entry.value)}
              />
              <Card.Table.Row label='Notas' content={entry.note} />
            </Card.Table.Root>
            <Card.Buttons>
              <PencilButton
                onClick={() => handleEditModal(entry)}
                size='mini'
              />
              <TrashButton
                onClick={() => handleDeleteModal(entry.id)}
                size='mini'
              />
            </Card.Buttons>
          </Card.Root>
        ))}
      </section>

      <Modal name='add' title='Adicionar Lançamento'>
        <EntryForm
          debitAccounts={debitAccounts}
          creditAccounts={creditAccounts}
          setEntries={setEntries}
        />
      </Modal>

      <Modal name='edit' title='Editar Lançamento'>
        <EntryForm
          debitAccounts={debitAccounts}
          creditAccounts={creditAccounts}
          entry={editEntry}
          setEntries={setEntries}
        />
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
    </Layout.Root>
  );
}
