import { useActionState, useState } from 'react';

import { Layout } from '../../Layout';
import { PlusButton } from '../../components/Buttons/PlusButton';
import { Form } from '../../components/Form';
import { Input } from '../../components/Form/Input';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';

import { useAppContext } from '../../hooks/useAppContext';
import type { FormState } from '../../contexts/AppContext';
import {
  CompanyApi,
  type TCompany,
  type TCompanyCreateData,
} from '../../api/company-api';

export function Companies() {
  const [selectedCompany, setSelectedCompany] = useState<TCompany>();

  const {
    setErrors,
    handleNotify,
    isTransitionLoading,
    setIsTransitionLoading,
    handleOpenModal,
    handleCloseModal,
    companies,
    setCompanies,
    currentCompany,
    // setCurrentCompany,
    changeCurrentCompany,
  } = useAppContext();

  const [createState, companyCreateAction] = useActionState(
    handleCompanyCreateAction,
    undefined,
  );

  async function handleCompanyCreateAction(
    _prev: FormState<TCompanyCreateData>,
    formData: FormData,
  ): Promise<FormState<TCompanyCreateData>> {
    setIsTransitionLoading(true);
    const data = {
      name: formData.get('name') as string,
    };
    const api = new CompanyApi();
    const response = await api.create(data);
    if (!response.ok) {
      setErrors(response.errors);
      return {
        data,
        errors: response.errors,
      };
    }
    setCompanies((prev) => [response.data.company, ...prev]);
    changeCurrentCompany(response.data.company);
    handleNotify({
      type: 'success',
      message: 'Empresa criada com sucesso!',
    });
    handleCloseModal();
  }

  const [_updateState, companyUpdateAction] = useActionState(
    handleCompanyUpdateAction,
    undefined,
  );

  async function handleCompanyUpdateAction(
    _prev: FormState<TCompanyCreateData>,
    formData: FormData,
  ): Promise<FormState<TCompanyCreateData>> {
    if (!selectedCompany) return;
    setIsTransitionLoading(true);
    const data = {
      name: formData.get('name') as string,
    };
    const api = new CompanyApi();
    const response = await api.update(selectedCompany.id, data);
    if (!response.ok) {
      setErrors(response.errors);
      return {
        data,
        errors: response.errors,
      };
    }
    const updatedCompany = response.data.company;
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company,
      ),
    );
    if (updatedCompany.id === currentCompany?.id)
      changeCurrentCompany(updatedCompany);
    handleNotify({
      type: 'success',
      message: 'Empresa editada com sucesso!',
    });
    handleCloseModal();
  }

  function handleCompanyUpdateOpenModal(company: TCompany) {
    setSelectedCompany(company);
    handleOpenModal('company-update');
  }

  function handleCompanyDeleteOpenModal() {
    handleOpenModal('company-delete');
  }

  async function handleDeleteSubmit() {
    if (!selectedCompany) return;
    setIsTransitionLoading(true);
    const api = new CompanyApi();
    const response = await api.delete(selectedCompany.id);
    if (!response.ok) {
      handleNotify({
        type: 'error',
        message: 'Erro ao excluir a empresa, tente novamente.',
      });
      return;
    }
    setCompanies((prev) => {
      const filtered = prev.filter(
        (company) => company.id !== selectedCompany.id,
      );
      if (selectedCompany.id === currentCompany?.id) {
        changeCurrentCompany(filtered.length > 0 ? filtered[0].id : '');
      }
      return filtered;
    });
    setSelectedCompany(undefined);
    handleCloseModal();
  }

  return (
    <>
      <Layout.Root>
        <Layout.Title text='Empresas'>
          <PlusButton onClick={() => handleOpenModal('company-create')} />
        </Layout.Title>

        <Table.Root
          head={['Nome da Empresa', 'Criada em']}
          textAlign={['left']}
        >
          {companies.map((company) => (
            <Table.Row
              key={company.id}
              onClick={() => handleCompanyUpdateOpenModal(company)}
            >
              <Table.Column textAlign='left'>{company.name}</Table.Column>
              <Table.Column>
                {new Date(company.created_at).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                })}
              </Table.Column>
            </Table.Row>
          ))}
        </Table.Root>
      </Layout.Root>
      <Modal name='company-create' title='Nova Empresa'>
        <Form
          action={companyCreateAction}
          submitButtonDisabled={isTransitionLoading}
        >
          <Input
            label='Nome da empresa'
            name='name'
            defaultValue={createState?.data?.name}
            required
          />
        </Form>
      </Modal>
      <Modal name='company-update' title='Editar Empresa'>
        <Form
          action={companyUpdateAction}
          submitButtonDisabled={isTransitionLoading}
        >
          <Input
            label='Nome da empresa'
            name='name'
            defaultValue={selectedCompany?.name}
            required
          />
          <small>
            <Button
              color='link'
              textColor='danger'
              size='medium'
              onClick={handleCompanyDeleteOpenModal}
            >
              Excluir empresa
            </Button>
          </small>
        </Form>
      </Modal>
      <Modal name='company-delete' title='Excluir Empresa'>
        <Form
          action={handleDeleteSubmit}
          submitButtonText='Confirmar'
          submitButtonDisabled={isTransitionLoading}
        >
          <p>
            Tem certeza que deseja excluir a empresa{' '}
            <strong>{selectedCompany?.name}</strong>? Todos os dados
            relacionados a ela será perdido.
          </p>
        </Form>
      </Modal>
    </>
  );
}
