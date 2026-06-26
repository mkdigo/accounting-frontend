import { useEffect, useRef, useState } from 'react';
import { DateTime } from '@mkdigo/datetime';

import { useAppContext } from '../../hooks/useAppContext';
import {
  EntryApi,
  type TEntry,
  type TEntrySearchParams,
} from '../../api/entry-api';
import { AccountApi, type TAccount } from '../../api/account-api';

interface IUseEntries {
  filterData: TEntrySearchParams;
  accounts: TAccount[];
  entries: TEntry[];
  setEntries: React.Dispatch<React.SetStateAction<TEntry[]>>;
  handleFilterInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: () => void;
  editEntry: TEntry | undefined;
  handleUpdateOpenModal: (entry: TEntry) => void;
  handleDeleteOpenModal: (id: string) => void;
  handleDeleteSubmit: (event: React.SubmitEvent) => void;
  lastEntryRef: React.Ref<HTMLDivElement>;
}

const startDateTime = new DateTime();
startDateTime.subtractMonth(6);
startDateTime.setDay(1);
const endDateTime = new DateTime();

export function useEntries(): IUseEntries {
  const {
    loader,
    handleCloseModal,
    handleOpenModal,
    handleNotify,
    currentCompany,
  } = useAppContext();

  const [filterData, setFilterData] = useState<TEntrySearchParams>({
    search: '',
    start: startDateTime.getDate(),
    end: endDateTime.getDate(),
  });
  const [accounts, setAccounts] = useState<TAccount[]>([]);
  const [entries, setEntries] = useState<TEntry[]>([]);

  const [editEntry, setEditEntry] = useState<TEntry>();
  const [deleteEntryId, setDeleteEntryId] = useState<string>('');
  const [entriesLastId, setEntriesLastId] = useState<string>();
  const lastEntryRef = useRef<HTMLDivElement>(null);

  // Load Accounts and Entries
  useEffect(() => {
    if (!currentCompany) return;
    const accountApi = new AccountApi();
    const entryApi = new EntryApi();
    loader(async () => {
      const [accountReponse, entryResponse] = await Promise.all([
        accountApi.list(currentCompany.id),
        entryApi.list(currentCompany.id, filterData),
      ]);
      if (accountReponse.ok) setAccounts(accountReponse.data.accounts);
      if (entryResponse.ok) {
        const entries = entryResponse.data.entries;
        setEntries(entries);
        setEntriesLastId(entries[entries.length - 1].id);
      }
    });
    return () => {
      accountApi.abort();
      entryApi.abort();
    };
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

  function handleSearchSubmit(): void {
    if (!currentCompany) return;
    getEntries();
  }

  const handleUpdateOpenModal = (entry: TEntry): void => {
    handleOpenModal('edit');
    setEditEntry(entry);
  };

  const handleDeleteOpenModal = (id: string): void => {
    handleOpenModal('delete');
    setDeleteEntryId(id);
  };

  const handleDeleteSubmit = async (
    event: React.SubmitEvent,
  ): Promise<void> => {
    event.preventDefault();
    loader(async () => {
      const api = new EntryApi();

      const response = await api.delete(deleteEntryId);

      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: 'Não foi possivel excluir o lançamento, tente novamente.',
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
  };

  return {
    filterData,
    accounts,
    entries,
    setEntries,
    handleFilterInputChange,
    handleSearchSubmit,
    editEntry,
    handleUpdateOpenModal,
    handleDeleteOpenModal,
    handleDeleteSubmit,
    lastEntryRef,
  };
}
