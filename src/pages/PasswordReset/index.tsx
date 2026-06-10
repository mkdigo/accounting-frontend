import { useState } from 'react';
import { useNavigate } from 'react-router';

import type { TErrors } from '../../components/Form/Wrapper';
import { Header } from '../../components/Header';
import { VerificationCode } from '../../components/VerificationCode';
import { Form } from '../../components/Form';
import { Input } from '../../components/Form/Input';

import { UserApi, type TVerificationCodeData } from '../../api/user-api';
import { useAppContext } from '../../hooks/useAppContext';
import { UserValidatior } from '../../validators/UserValidator';
import { Token } from '../../utils/token';

import styles from './styles.module.css';

const userValidator = new UserValidatior();

export function PasswordReset() {
  const navigate = useNavigate();
  const { setIsLoading, handleNotify } = useAppContext();
  const [codeData, setCodeData] = useState<TVerificationCodeData>({
    email: '',
    code: '',
  });
  const [data, setData] = useState({
    password: '',
    password_confirmation: '',
  });
  const [wasCodeSent, setWasCodeSent] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [errors, setErrors] = useState<TErrors>({});

  function handleCodeDataChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (Object.keys(errors).includes(event.target.name)) {
      setErrors((prev) => {
        let updatedErrors = { ...prev };
        delete updatedErrors[event.target.name];
        return updatedErrors;
      });
    }
    setCodeData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSendPasswordResetCode() {
    if (codeData.email === '' || !userValidator.isValidEmail(codeData.email)) {
      setErrors({
        email: ['Email inválido'],
      });
      return;
    }
    setIsLoading(true);
    const api = new UserApi();
    const response = await api.passwordResetCode({ email: codeData.email });
    setIsLoading(false);
    if (!response.ok) {
      let message = 'Falha ao enviar o código.';
      if (response.status === 404) message = 'Email não encontrado';
      handleNotify({ type: 'error', message });
      return;
    }
    handleNotify({ type: 'success', message: 'Código enviado' });
    setWasCodeSent(true);
  }

  async function handlePassworResetGetTokenSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setIsLoading(true);
    const api = new UserApi();
    const response = await api.passwordResetToken(codeData);
    setIsLoading(false);
    if (!response.ok) {
      setErrors({
        code: ['Código inválido'],
      });
      return;
    }
    Token.set(response.data.token);
    setHasToken(true);
  }

  function handleDataChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (Object.keys(errors).includes(event.target.name)) {
      setErrors((prev) => {
        let updatedErrors = { ...prev };
        delete updatedErrors[event.target.name];
        return updatedErrors;
      });
    }
    setData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handlePasswordResetSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (!userValidator.isValidPasswordResetData(data)) {
      console.log('invalid', userValidator.errors);
      setErrors(userValidator.errors);
      return;
    }
    setIsLoading(true);
    const api = new UserApi();
    const response = await api.passwordReset(data);
    setIsLoading(false);
    if (!response.ok) {
      if (response.errors) setErrors(response.errors);
      handleNotify({
        type: 'error',
        message:
          'Não foi possível redefinir sua senha, tente novamente mais tarde.',
      });
      return;
    }
    handleNotify({
      type: 'success',
      message: 'Senha redefinida com sucesso!',
    });
    navigate('/login');
  }

  return !hasToken ? (
    <VerificationCode
      title='Redefinição de senha'
      data={codeData}
      errors={errors}
      onChange={handleCodeDataChange}
      sendVerificationCode={handleSendPasswordResetCode}
      verificationCodeSubmit={handlePassworResetGetTokenSubmit}
      wasCodeSent={wasCodeSent}
    />
  ) : (
    <>
      <Header />
      <main className={styles.main}>
        <h1>Redefinição de senha</h1>
        <Form cancelButtonShow={false} onSubmit={handlePasswordResetSubmit}>
          <Input
            label='Senha nova'
            name='password'
            type='password'
            value={data.password}
            onChange={handleDataChange}
            errors={errors}
            required
          />
          <Input
            label='Confirme a senha nova'
            name='password_confirmation'
            type='password'
            value={data.password_confirmation}
            onChange={handleDataChange}
            errors={errors}
            required
          />
        </Form>
      </main>
    </>
  );
}
