import { useEffect, useRef, useState } from 'react';
import { DateTime } from '@mkdigo/datetime';

import { useAppContext } from '../../hooks/useAppContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import type { TAccount } from '../../api/account-api';
import {
  EntryApi,
  type TEntry,
  type TEntrySearchParams,
} from '../../api/entry-api';
import { NumberHandler } from '../../utils/NumberHandler';

import { Layout } from '../../Layout';
import { SelectWithFilter } from '../../components/Form/SelectWithFilter';
import { PlusButton } from '../../components/Buttons/PlusButton';
import { Modal } from '../../components/Modal';
import { TextArea } from '../../components/Form/TextArea';
import { Input } from '../../components/Form/Input';
import { Form } from '../../components/Form';
import { MinusButton } from '../../components/Buttons/MinusButton';
import { AccountEntriesList } from '../../components/AccountEntriesList';

import styles from './styles.module.css';

const dateTime = new DateTime();
dateTime.subtractMonth(6);
dateTime.setDay(1);

export function Banks() {
  const {
    handleOpenModal,
    isTransitionLoading,
    loader,
    handleNotify,
    errorsRemove,
    setErrors,
  } = useAppContext();
  const { accounts, currentCompany } = useAuthContext();
  const [banks, setBanks] = useState<TAccount[]>([]);
  const [selectedBank, setSelectedBank] = useState<TAccount>();
  const [entries, setEntries] = useState<TEntry[]>([]);
  const [filterData, setFilterData] = useState<TEntrySearchParams>({
    search: '',
    start: dateTime.getDate(),
    end: dateTime.getToday(),
    accountId: 'none',
  });
  const [createData, setCreateData] = useState({
    inclusion: dateTime.getToday(),
    accountId: '',
    value: 0,
    note: '',
  });
  const [createAction, setCreateAction] = useState<'plus' | 'sub'>('plus');
  const inputDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filter = accounts.filter((account) => account.tags.includes('bank'));
    setBanks(filter);
    if (filter.length > 0) {
      const account = filter[0];
      setSelectedBank(account);
      setFilterData((prev) => ({
        ...prev,
        accountId: account.id,
      }));
    }
  }, [accounts]);

  function handleBankChange(id: string) {
    const foundBank = banks.filter((bank) => bank.id === id)[0];
    if (!foundBank) return;
    setSelectedBank(foundBank);
    setFilterData((prev) => ({
      ...prev,
      accountId: foundBank.id,
    }));
  }

  function handleInputChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ): void {
    let value: string | number = event.target.value;
    errorsRemove(event.target.name);

    if (event.target.dataset.maskNumber) {
      value = NumberHandler.stringToFloat(event.target.value);
    }

    setCreateData((prev) => ({
      ...prev,
      [event.target.name]: value,
    }));
  }

  function handleSelectChange({
    name,
    value,
  }: {
    value: string;
    name: string;
  }): void {
    setCreateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleEntryCreateSubmit(
    event: React.SubmitEvent,
  ): Promise<void> {
    event.preventDefault();
    if (!currentCompany || !selectedBank) return;
    loader(async () => {
      const api = new EntryApi();
      const response = await api.create(currentCompany.id, {
        inclusion: createData.inclusion,
        value: createData.value,
        note: createData.note,
        debitId:
          createAction === 'plus' ? selectedBank.id : createData.accountId,
        creditId:
          createAction === 'sub' ? selectedBank.id : createData.accountId,
      });

      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: response.message,
        });
        setErrors(response.errors);
        return;
      }

      setCreateData((prev) => ({
        ...prev,
        accountId: '',
        value: 0,
        note: '',
      }));

      inputDateRef.current?.focus();

      if (setEntries)
        setEntries((prev) => {
          const updatedEntries = [response.data.entry, ...prev];
          return updatedEntries.sort((a, b) =>
            b.inclusion.localeCompare(a.inclusion),
          );
        });

      handleNotify({
        type: 'success',
        message: 'Lançamento criado com sucesso!',
      });
    });
  }

  function handlePlusButtonClick() {
    setCreateAction('plus');
    handleOpenModal('add');
  }

  function handleMinusButtonClick() {
    setCreateAction('sub');
    handleOpenModal('add');
  }

  return (
    <Layout.Root>
      <Layout.Title text='Bancos'>
        <PlusButton onClick={handlePlusButtonClick} size='medium' />
        <MinusButton
          color='danger'
          onClick={handleMinusButtonClick}
          size='medium'
        />
      </Layout.Title>
      <section className={styles.bankSelect}>
        <SelectWithFilter
          label='Banco'
          name='bank'
          value={selectedBank?.id ?? ''}
          options={banks.map((bank) => ({
            label: bank.name,
            value: bank.id,
          }))}
          onChange={({ value }) => {
            handleBankChange(value);
          }}
        />
      </section>

      {selectedBank && (
        <AccountEntriesList
          account={selectedBank}
          entries={entries}
          setEntries={setEntries}
          filterData={filterData}
          setFilterData={setFilterData}
          debitAccounts={accounts}
          creditAccounts={accounts}
        />
      )}

      <Modal name='add' title={createAction === 'plus' ? 'Entrada' : 'Saída'}>
        <Form
          onSubmit={handleEntryCreateSubmit}
          cancelButtonText='Fechar'
          submitButtonDisabled={isTransitionLoading}
        >
          <Input
            label='Data'
            type='date'
            name='inclusion'
            value={createData.inclusion}
            onChange={handleInputChange}
            required
            innerRef={inputDateRef}
          />
          <SelectWithFilter
            label='Conta'
            name='accountId'
            value={createData.accountId}
            options={accounts
              .filter((account) => account.id !== selectedBank?.id)
              .map((account) => ({
                label: account.name,
                value: account.id,
              }))}
            onChange={handleSelectChange}
            required
          />
          <Input
            label='Valor'
            name='value'
            value={NumberHandler.currency(createData.value)}
            onChange={handleInputChange}
            required
            data-mask-number
          />
          <TextArea
            label='Notas'
            name='note'
            value={createData.note}
            onChange={handleInputChange}
          />
        </Form>
      </Modal>
    </Layout.Root>
  );
}
