import { useEffect, useState } from 'react';
import { DateTime } from '@mkdigo/datetime';

import { type TAccount } from '../../api/account-api';
import { type TEntry, type TEntrySearchParams } from '../../api/entry-api';

import { Layout } from '../../Layout';
import { Modal } from '../../components/Modal';
import { PlusButton } from '../../components/Buttons/PlusButton';
import { EntryForm } from '../../components/EntryForm';

import { useAppContext } from '../../hooks/useAppContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { EntriesList } from '../../components/EntriesList';

const dateTime = new DateTime();
dateTime.subtractMonth(6);
dateTime.setDay(1);

export function Expenses() {
  const { handleOpenModal } = useAppContext();
  const { accounts } = useAuthContext();
  const [debitAccounts, setDebitAccounts] = useState<TAccount[]>([]);
  const [creditAccounts, setCreditAccounts] = useState<TAccount[]>([]);
  const [entries, setEntries] = useState<TEntry[]>([]);
  const [filterData, setFilterData] = useState<TEntrySearchParams>({
    search: '',
    start: dateTime.getDate(),
    end: dateTime.getToday(),
    subgroup: 'expenses',
  });

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

  return (
    <Layout.Root>
      <Layout.Title text='Despesas'>
        <PlusButton onClick={() => handleOpenModal('add')} size='medium' />
      </Layout.Title>

      <EntriesList
        entries={entries}
        setEntries={setEntries}
        debitAccounts={debitAccounts}
        creditAccounts={creditAccounts}
        filterData={filterData}
        setFilterData={setFilterData}
      />

      <Modal name='add' title='Adicionar Lançamento'>
        <EntryForm
          debitAccounts={debitAccounts}
          creditAccounts={creditAccounts}
          setEntries={setEntries}
        />
      </Modal>
    </Layout.Root>
  );
}
