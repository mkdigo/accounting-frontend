import { Layout } from '../../Layout';
import { Modal } from '../../components/Modal';
import { PrintButton } from '../../components/Buttons/PrintButton';
import { PlusButton } from '../../components/Buttons/PlusButton';
import { EntryForm } from '../../components/EntryForm';

import { useAppContext } from '../../hooks/useAppContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useEntries } from './useEntries';
import { EntriesList } from '../../components/EntriesList';

export function Entries() {
  const { filterData, setFilterData, entries, setEntries } = useEntries();

  const { handleOpenModal } = useAppContext();
  const { accounts } = useAuthContext();

  return (
    <Layout.Root>
      <Layout.Title text='Lançamentos'>
        <PrintButton size='medium' />
        <PlusButton onClick={() => handleOpenModal('add')} size='medium' />
      </Layout.Title>

      <EntriesList
        entries={entries}
        setEntries={setEntries}
        debitAccounts={accounts}
        creditAccounts={accounts}
        filterData={filterData}
        setFilterData={setFilterData}
      />

      <Modal name='add' title='Adicionar Lançamento'>
        <EntryForm
          debitAccounts={accounts}
          creditAccounts={accounts}
          setEntries={setEntries}
        />
      </Modal>
    </Layout.Root>
  );
}
