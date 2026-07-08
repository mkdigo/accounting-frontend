import { useEffect, useRef, useState } from 'react';
import { DateTime } from '@mkdigo/datetime';

import { Form } from '../Form';
import { Input } from '../Form/Input';
import { SelectWithFilter } from '../Form/SelectWithFilter';
import { TextArea } from '../Form/TextArea';

import { useAppContext } from '../../hooks/useAppContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import type { TAccount } from '../../api/account-api';
import { EntryApi, type TEntry, type TEntryData } from '../../api/entry-api';
import { NumberHandler } from '../../utils/NumberHandler';

interface IProps {
  debitAccounts: TAccount[];
  creditAccounts: TAccount[];
  entry?: TEntry;
  setEntries?: React.Dispatch<React.SetStateAction<TEntry[]>>;
}

export function EntryForm({
  debitAccounts,
  creditAccounts,
  entry,
  setEntries,
}: IProps) {
  const today = new DateTime();
  const {
    handleCloseModal,
    loader,
    isTransitionLoading,
    handleNotify,
    setErrors,
    errorsRemove,
  } = useAppContext();
  const { currentCompany } = useAuthContext();
  const [data, setData] = useState<TEntryData>({
    inclusion: today.getDate(),
    debitId: '',
    creditId: '',
    value: 0,
    note: '',
  });
  const inputDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!entry) return;

    setData({
      id: entry.id,
      debitId: entry.debit_id,
      creditId: entry.credit_id,
      inclusion: entry.inclusion,
      note: entry.note,
      value: entry.value,
    });
  }, [entry]);

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

    setData((prev) => ({
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
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleEntryCreateSubmit(): Promise<void> {
    if (!currentCompany) return;
    loader(async () => {
      const api = new EntryApi();
      const response = await api.create(currentCompany.id, data);

      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: response.message,
        });
        setErrors(response.errors);
        return;
      }

      setData((prev) => ({
        ...prev,
        debit_id: 0,
        credit_id: 0,
        value: 0,
        note: '',
      }));

      inputDateRef.current?.focus();

      if (setEntries) setEntries((prev) => [response.data.entry, ...prev]);

      handleNotify({
        type: 'success',
        message: 'Lançamento criado com sucesso!',
      });
    });
  }

  async function handleEntryUpdateSubmit(): Promise<void> {
    loader(async () => {
      const api = new EntryApi();
      const response = await api.update(data);

      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: response.message,
        });
        return;
      }

      inputDateRef.current?.focus();

      handleCloseModal();

      if (setEntries) {
        setEntries((prev) => {
          return prev.map((newEntry) => {
            if (newEntry.id === response.data.entry.id)
              return response.data.entry;
            return newEntry;
          });
        });
      }

      handleNotify({
        type: 'success',
        message: 'Lançamento editado com sucesso!',
      });
    });
  }

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();

    if (entry) handleEntryUpdateSubmit();
    else handleEntryCreateSubmit();
  }

  return (
    <Form
      onSubmit={handleSubmit}
      cancelButtonText='Fechar'
      submitButtonDisabled={isTransitionLoading}
    >
      <Input
        label='Data'
        type='date'
        name='inclusion'
        value={data.inclusion}
        onChange={handleInputChange}
        required
        innerRef={inputDateRef}
      />
      <SelectWithFilter
        label='Débito'
        name='debitId'
        value={data.debitId}
        options={debitAccounts.map((account) => ({
          label: account.name,
          value: account.id,
        }))}
        onChange={handleSelectChange}
        required
      />
      <SelectWithFilter
        label='Crédito'
        name='creditId'
        value={data.creditId}
        options={creditAccounts.map((account) => ({
          label: account.name,
          value: account.id,
        }))}
        onChange={handleSelectChange}
        required
      />
      <Input
        label='Valor'
        name='value'
        value={NumberHandler.currency(data.value)}
        onChange={handleInputChange}
        required
        data-mask-number
      />
      <TextArea
        label='Notas'
        name='note'
        value={data.note}
        onChange={handleInputChange}
      />
    </Form>
  );
}
