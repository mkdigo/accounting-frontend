import { Layout } from '../../Layout';
import { Modal } from '../../components/Modal';
import { PrintButton } from '../../components/Buttons/PrintButton';
import { PlusButton } from '../../components/Buttons/PlusButton';
import { PencilButton } from '../../components/Buttons/PencilButton';
import { TrashButton } from '../../components/Buttons/TrashButton';
import { Input } from '../../components/Form/Input';
import { Card } from '../../components/Card';
import { EntryForm } from '../../components/EntryForm';
import { Form } from '../../components/Form';

import { useAppContext } from '../../hooks/useAppContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useEntries } from './useEntries';
import { NumberHandler } from '../../utils/NumberHandler';

export function Entries() {
  const {
    filterData,
    entries,
    setEntries,
    handleSearchSubmit,
    handleFilterInputChange,
    editEntry,
    handleUpdateOpenModal,
    handleDeleteOpenModal,
    handleDeleteSubmit,
    lastEntryRef,
  } = useEntries();

  const { handleOpenModal } = useAppContext();
  const { accounts } = useAuthContext();

  return (
    <Layout.Root>
      <Layout.Title text='Lançamentos'>
        <PrintButton size='medium' />
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
                onClick={() => handleUpdateOpenModal(entry)}
                size='mini'
              />
              <TrashButton
                onClick={() => handleDeleteOpenModal(entry.id)}
                size='mini'
              />
            </Card.Buttons>
          </Card.Root>
        ))}
      </section>

      <Modal name='add' title='Adicionar Lançamento'>
        <EntryForm
          debitAccounts={accounts}
          creditAccounts={accounts}
          setEntries={setEntries}
        />
      </Modal>

      <Modal name='edit' title='Editar Lançamento'>
        <EntryForm
          debitAccounts={accounts}
          creditAccounts={accounts}
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
