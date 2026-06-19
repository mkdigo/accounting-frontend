import { useEffect, useState } from 'react';

import { useAppContext } from '../../hooks/useAppContext';
import {
  AccountApi,
  accountSubgroups,
  type TAccount,
  type TTagName,
} from '../../api/account-api';
import { AccountTranslations } from '../../translations/account-translations';
import { TagTranslations } from '../../translations/tag-translations';

import { Layout } from '../../Layout';
import { PlusButton } from '../../components/Buttons/PlusButton';
import { Modal } from '../../components/Modal';
import { Form } from '../../components/Form';
import { Card } from '../../components/Card';
import { PencilButton } from '../../components/Buttons/PencilButton';
import { TrashButton } from '../../components/Buttons/TrashButton';
import { AccountForm } from '../../components/AccountForm';
import { Button } from '../../components/Button';
import { Select } from '../../components/Form/Select';

import styles from './styles.module.css';

export function Accounts() {
  const {
    lang,
    handleOpenModal,
    handleCloseModal,
    handleNotify,
    loader,
    isTransitionLoading,
    currentCompany,
  } = useAppContext();
  const [accounts, setAccounts] = useState<TAccount[]>([]);

  const [selectedAccount, setSelectedAccount] = useState<TAccount>();
  const [availableTags, setAvailableTags] = useState<TTagName[]>([]);
  const [selectedTag, setSelectedTag] = useState<{
    accountId: string | null;
    tag: TTagName | null;
  }>({
    accountId: null,
    tag: null,
  });

  useEffect(() => {
    if (!currentCompany) return;
    const api = new AccountApi();
    loader(async () => {
      const response = await api.list(currentCompany.id);
      if (!response.ok) return;
      setAccounts(response.data.accounts);
    });

    return () => {
      api.abort();
    };
  }, [currentCompany]);

  function handleAccountUpdateOpenModal(account: TAccount) {
    setSelectedAccount(account);
    handleOpenModal('account-update');
  }

  function handleAccountDeleteOpenModal(account: TAccount) {
    setSelectedAccount(account);
    handleOpenModal('account-delete');
  }

  function handleAccountDeleteSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (!selectedAccount) return;
    loader(async () => {
      const api = new AccountApi();
      const response = await api.delete(selectedAccount.id);
      if (!response.ok) {
        handleNotify({
          type: 'error',
          message:
            'Não foi possível excluir a conta, talvez ela esteja em uso não possa ser excluida.',
        });
        return;
      }
      setAccounts((prev) =>
        prev.filter((account) => account.id !== selectedAccount.id),
      );
      handleCloseModal();
      handleNotify({ type: 'success', message: 'Conta excluida com sucesso!' });
    });
  }

  function handleGetTags(account: TAccount): TTagName[] {
    if (!account.subgroup) return [];
    const tags: TTagName[] = [...accountSubgroups[account.subgroup].tags];
    const diff = tags.filter((tag) => !account.tags.includes(tag));
    return diff;
  }

  function handleTagAddOpenModal(account: TAccount) {
    const tags = handleGetTags(account);
    if (tags.length === 0) return;
    setAvailableTags(tags);
    setSelectedTag({
      accountId: account.id,
      tag: tags[0],
    });
    handleOpenModal('tag-add');
  }

  async function handleTagAddSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (!selectedTag.accountId || !selectedTag.tag) return;
    loader(async () => {
      const api = new AccountApi();
      const response = await api.addTag(selectedTag.accountId!, {
        tagName: selectedTag.tag!,
      });
      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: 'Não foi possível adicionar a tag, tente novamente.',
        });
        return;
      }
      setAccounts((prev) =>
        prev.map((account) => {
          if (account.id !== response.data.account.id) return account;
          return response.data.account;
        }),
      );
      setSelectedTag({ accountId: null, tag: null });
      handleNotify({ type: 'success', message: 'Tag adicionada com sucesso!' });
      handleCloseModal();
    });
  }

  function handleTagDeleteOpenModal(accountId: string, tag: TTagName) {
    setSelectedTag({
      accountId,
      tag,
    });
    handleOpenModal('tag-delete');
  }

  function handleTagDeleteSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (!selectedTag.accountId || !selectedTag.tag) return;
    loader(async () => {
      const api = new AccountApi();
      const response = await api.removeTag(selectedTag.accountId!, {
        tagName: selectedTag.tag!,
      });
      if (!response.ok) {
        handleNotify({
          type: 'error',
          message: 'Não foi possível excluir a tag, tente novamente.',
        });
        return;
      }
      setAccounts((prev) =>
        prev.map((account) => {
          if (account.id !== response.data.account.id) return account;
          return response.data.account;
        }),
      );
      setSelectedTag({ accountId: null, tag: null });
      handleNotify({ type: 'success', message: 'Tag excluida com sucesso!' });
      handleCloseModal();
    });
  }

  return (
    <>
      <Layout.Root>
        <Layout.Title text='Contas'>
          <PlusButton onClick={() => handleOpenModal('account-create')} />
        </Layout.Title>
        {accounts
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((account) => (
            <Card.Root key={account.id}>
              <Card.Table.Root>
                <Card.Table.Row label='Nome' content={account.name} />
                <Card.Table.Row
                  label='Grupo'
                  content={AccountTranslations.group(account.group)[lang]}
                />
                <Card.Table.Row
                  label='Subgrupo'
                  content={AccountTranslations.subgroup(account.subgroup)[lang]}
                />
                <Card.Table.Row label='Tags'>
                  <div className={styles.tagContainer}>
                    {account.tags.map((tag) => (
                      <Button
                        color='transparent'
                        textColor='dark'
                        size='mini'
                        key={`tag-button-${tag}`}
                        onClick={() =>
                          handleTagDeleteOpenModal(account.id, tag)
                        }
                      >
                        {TagTranslations.name(tag)[lang]}
                      </Button>
                    ))}
                    {account.subgroup &&
                      account.tags.length === 0 &&
                      handleGetTags(account).length > 0 && (
                        <PlusButton
                          size='mini'
                          onClick={() => handleTagAddOpenModal(account)}
                        />
                      )}
                  </div>
                </Card.Table.Row>
              </Card.Table.Root>
              <Card.Buttons>
                <PencilButton
                  onClick={() => handleAccountUpdateOpenModal(account)}
                  size='medium'
                />
                <TrashButton
                  onClick={() => handleAccountDeleteOpenModal(account)}
                  size='medium'
                />
              </Card.Buttons>
            </Card.Root>
          ))}
        {/* <Table.Root
          head={['Nome', 'Grupo', 'Subgrupo', 'Tags']}
          textAlign={['left', 'left', 'left']}
        >
          {accounts
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((account) => (
              <Table.Row
                key={account.id}
                onClick={() => handleAccountUpdateOpenModal(account)}
              >
                <Table.Column textAlign='left'>{account.name}</Table.Column>
                <Table.Column textAlign='left'>
                  {AccountTranslations.group(account.group)[lang]}
                </Table.Column>
                <Table.Column textAlign='left'>
                  {AccountTranslations.subgroup(account.subgroup)[lang]}
                </Table.Column>
                <Table.Column textAlign='left'>
                  {account.tags
                    .map((tag) => TagTranslations.name(tag)[lang])
                    .sort()
                    .join(', ')}
                </Table.Column>
              </Table.Row>
            ))}
        </Table.Root> */}
      </Layout.Root>
      <Modal name='account-create' title='Criar uma conta'>
        <AccountForm setAccounts={setAccounts} />
      </Modal>
      <Modal name='account-update' title='Editar uma conta'>
        <AccountForm account={selectedAccount} setAccounts={setAccounts} />
      </Modal>
      <Modal name='account-delete' title='Excluir Conta'>
        <Form
          onSubmit={handleAccountDeleteSubmit}
          submitButtonText='Confirmar'
          submitButtonDisabled={isTransitionLoading}
        >
          <p>
            Tem certeza que deseja excluir a conta{' '}
            <strong>{selectedAccount?.name}</strong>? Todos os dados
            relacionados a ela será perdido.
          </p>
        </Form>
      </Modal>
      <Modal name='tag-add' title='Adicionar uma tag'>
        <Form onSubmit={handleTagAddSubmit}>
          <Select
            label='Tag'
            name='tag'
            value={selectedTag.tag ?? undefined}
            onChange={(event) =>
              setSelectedTag((prev) => ({
                ...prev,
                tag: event.target.value as any,
              }))
            }
          >
            {availableTags.map((tag) => (
              <option value={tag} key={`tag-add-${tag}`}>
                {TagTranslations.name(tag)[lang]}
              </option>
            ))}
          </Select>
        </Form>
      </Modal>
      <Modal name='tag-delete' title='Excluir Tag'>
        <Form
          onSubmit={handleTagDeleteSubmit}
          submitButtonText='Confirmar'
          submitButtonDisabled={isTransitionLoading}
        >
          <p>
            Tem certeza que deseja excluir a tag{' '}
            <strong>
              {selectedTag.tag && TagTranslations.name(selectedTag.tag)[lang]}
            </strong>
            ?
          </p>
        </Form>
      </Modal>
    </>
  );
}
