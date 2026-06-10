import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Header } from '../../components/Header';
import { Form } from '../../components/Form';
import { Input } from '../../components/Form/Input';
import type { TErrors } from '../../components/Form/Wrapper';

import { ZipcodeApi } from '../../api/zipcode-api';
import { UserApi, type TUserCreateData } from '../../api/user-api';
import { Mask } from '../../utils/mask';
import { UserValidatior } from '../../validators/UserValidator';

import { useAppContext } from '../../hooks/useAppContext';

import styles from './styles.module.css';

export function Register() {
  const navigate = useNavigate();
  const { setIsLoading, handleNotify } = useAppContext();
  const [data, setData] = useState<TUserCreateData>({
    name: '',
    email: '',
    cellphone: '',
    zipcode: '',
    state: '',
    city: '',
    district: '',
    address: '',
    username: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<TErrors>({});

  useEffect(() => {
    const zipcode = data.zipcode.replace(/\D/g, '');
    if (zipcode.length !== 8) return;
    const api = new ZipcodeApi();
    api.get(zipcode).then((data) => {
      if (!data) return;
      setData((prev) => ({
        ...prev,
        state: data.uf,
        city: data.localidade,
        district: data.bairro,
        address: data.logradouro,
      }));
      document.querySelector<HTMLInputElement>('[name="address"]')?.focus();
    });
  }, [data.zipcode]);

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();

    setIsLoading(true);
    const api = new UserApi();
    const response = await api.create(data);
    setIsLoading(false);
    if (!response.ok) {
      setErrors(response.errors ?? {});
      return;
    }
    handleNotify({ type: 'success', message: 'Registro criado com sucesso' });
    navigate('/users/email-verify', { state: { email: data.email } });
  }

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData((prev) => {
      let changeData = { ...prev, [event.target.name]: event.target.value };

      if (event.target.name === 'cellphone')
        changeData.cellphone = Mask.cellPhone(event.target.value);

      if (event.target.name === 'zipcode') {
        changeData.zipcode = Mask.zipcode(event.target.value);
      }

      return changeData;
    });
  }

  function handleValidator() {
    const validator = new UserValidatior();

    if (validator.isValidCreateData(data)) {
      if (Object.keys(errors).length > 0) setErrors({});
      return;
    }
    setErrors(validator.errors);
  }
  return (
    <>
      <Header title='Crie sua conta gratuita' />
      <main className={styles.main}>
        <Form
          onSubmit={handleSubmit}
          submitButtonDisabled={Object.keys(errors).length > 0}
          cancelButtonAction='navigateBack'
        >
          <Input
            label='Nome'
            name='name'
            value={data.name}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='E-mail'
            type='email'
            name='email'
            value={data.email}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='Celular'
            name='cellphone'
            value={data.cellphone}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='CEP'
            name='zipcode'
            value={data.zipcode}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='Estado'
            name='state'
            value={data.state}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='Cidade'
            name='city'
            value={data.city}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='Bairro'
            name='district'
            value={data.district}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='Endereço'
            name='address'
            value={data.address}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='Nome de usuário'
            name='username'
            value={data.username}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='Senha'
            name='password'
            type='password'
            value={data.password}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
          <Input
            label='Confirmar Senha'
            name='password_confirmation'
            type='password'
            value={data.password_confirmation}
            onChange={handleOnChange}
            onBlur={handleValidator}
            required
            errors={errors}
          />
        </Form>
      </main>
    </>
  );
}
