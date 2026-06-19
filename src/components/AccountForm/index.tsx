import { useEffect, useState } from 'react';

import { Form } from '../Form';
import { useAppContext } from '../../hooks/useAppContext';
import { Select } from '../Form/Select';
import { Input } from '../Form/Input';
import {
  AccountApi,
  accountGroups,
  type TAccount,
  type TAccountCreateData,
  type TAccountSubgroup,
} from '../../api/account-api';
import { AccountTranslations } from '../../translations/account-translations';
import { TagSelect } from '../TagSelect';

type Props = {
  account?: TAccount;
  setAccounts: React.Dispatch<React.SetStateAction<TAccount[]>>;
};

export function AccountForm({ account, setAccounts }: Props) {
  const {
    lang,
    loader,
    isTransitionLoading,
    handleNotify,
    handleCloseModal,
    currentCompany,
    setErrors,
    errorsRemove,
  } = useAppContext();
  const [data, setData] = useState<TAccountCreateData>({
    company_id: '',
    name: '',
    group: 'assets',
    subgroup: 'current_assets',
    tags: [],
  });
  const [availableSubgroups, setAvailableSubgroups] = useState<
    TAccountSubgroup[]
  >([]);

  useEffect(() => {
    if (!currentCompany) return;
    let data: TAccountCreateData = {
      company_id: currentCompany.id,
      name: '',
      group: 'assets',
      subgroup: 'current_assets',
      tags: [],
    };
    if (account) {
      data = {
        ...data,
        name: account.name,
        group: account.group,
        subgroup: account.subgroup,
        tags: account.tags,
      };
    }

    setData(data);
  }, [account, currentCompany]);

  useEffect(() => {
    const subgroups = [...accountGroups[data.group].subgroup];

    setAvailableSubgroups(subgroups);

    setData((prev) => {
      return {
        ...prev,
        subgroup: subgroups[0] ?? null,
      };
    });
  }, [data.group]);

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const name = event.target.name;
    errorsRemove(name);
    setData((prev) => ({
      ...prev,
      [name]: event.target.value,
    }));
  }

  async function handleAccountCreateSubmit() {
    loader(async () => {
      const api = new AccountApi();
      const response = await api.create(data);
      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: 'Erro ao criar a conta, tente novamente.',
        });
        setErrors(response.errors);
        return;
      }
      handleNotify({ type: 'success', message: 'Contra criada com sucesso!' });
      setAccounts((prev) => [response.data.account, ...prev]);
      handleCloseModal();
    });
  }

  async function handleAccountUpdateSubmit() {
    if (!account) return;
    loader(async () => {
      const api = new AccountApi();
      const response = await api.update(account.id, data);
      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: 'Erro ao editar a conta, tente novamente.',
        });
        setErrors(response.errors);
        return;
      }
      handleNotify({ type: 'success', message: 'Contra editada com sucesso!' });
      setAccounts((prev) =>
        prev.map((a) => {
          if (account.id !== a.id) return a;
          return response.data.account;
        }),
      );
      handleCloseModal();
    });
  }

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();

    if (account) handleAccountUpdateSubmit();
    else handleAccountCreateSubmit();
  }

  return (
    <Form onSubmit={handleSubmit} submitButtonDisabled={isTransitionLoading}>
      <Input
        label='Nome'
        name='name'
        value={data.name}
        onChange={handleInputChange}
        required
      />
      <Select
        label='Grupo'
        name='group'
        value={data.group}
        onChange={handleInputChange}
        required
      >
        {(Object.keys(accountGroups) as Array<keyof typeof accountGroups>).map(
          (group) => (
            <option value={group} key={`account-group-${group}`}>
              {AccountTranslations.group(group)[lang]}
            </option>
          ),
        )}
      </Select>
      <Select
        label='Subgrupo'
        name='subgroup'
        value={data.subgroup ?? ''}
        onChange={handleInputChange}
      >
        {availableSubgroups.map((subgroup) => (
          <option value={subgroup} key={`account-subgroup-${subgroup}`}>
            {AccountTranslations.subgroup(subgroup)[lang]}
          </option>
        ))}
      </Select>
      {!account && (
        <TagSelect
          data={data}
          onChange={(tags) => {
            setData((prev) => ({
              ...prev,
              tags,
            }));
          }}
        />
      )}
    </Form>
  );
}
