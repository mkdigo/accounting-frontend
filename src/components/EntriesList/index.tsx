import { useEffect, useRef, useState } from 'react';

import {
  EntryApi,
  type TEntry,
  type TEntrySearchParams,
} from '../../api/entry-api';
import type { TAccount } from '../../api/account-api';
import { useAppContext } from '../../hooks/useAppContext';
import { NumberHandler } from '../../utils/NumberHandler';

import { PencilButton } from '../Buttons/PencilButton';
import { TrashButton } from '../Buttons/TrashButton';
import { Card } from '../Card';
import { Modal } from '../Modal';
import { EntryForm } from '../EntryForm';
import { Form } from '../Form';
import { Layout } from '../../Layout';
import { Input } from '../Form/Input';
import { useAuthContext } from '../../hooks/useAuthContext';

type Props = {
  entries: TEntry[];
  setEntries: React.Dispatch<React.SetStateAction<TEntry[]>>;
  debitAccounts: TAccount[];
  creditAccounts: TAccount[];
  filterData: TEntrySearchParams;
  setFilterData: React.Dispatch<React.SetStateAction<TEntrySearchParams>>;
};

export function EntriesList({
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
  const lastEntryRef = useRef<HTMLDivElement>(null);

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

  function handleDeleteModal(entry: TEntry): void {
    handleOpenModal('delete');
    setSelectedEntry(entry);
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
                onClick={() => handleDeleteModal(entry)}
                size='mini'
              />
            </Card.Buttons>
          </Card.Root>
        ))}
      </section>
      <Modal name='edit' title='Editar Lançamento'>
        <EntryForm
          debitAccounts={debitAccounts}
          creditAccounts={creditAccounts}
          entry={selectedEntry}
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
    </>
  );
}
