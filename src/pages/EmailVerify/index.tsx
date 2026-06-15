import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { VerificationCode } from '../../components/VerificationCode';

import { UserApi, type TVerificationCodeData } from '../../api/user-api';
import { useAppContext } from '../../hooks/useAppContext';
import { UserValidatior } from '../../validators/UserValidator';
import { Token } from '../../utils/token';

type TLocation = {
  state?: {
    email?: string;
  };
};

const userValidator = new UserValidatior();

export function EmailVerify() {
  const location: TLocation = useLocation();
  const navigate = useNavigate();
  const { setIsLoading, handleNotify, setErrors, errorsRemove } =
    useAppContext();
  const [data, setData] = useState<TVerificationCodeData>({
    email: location.state?.email ?? '',
    code: '',
  });
  const [wasCodeSent, setWasCodeSent] = useState<boolean>(
    location.state?.email ? true : false,
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    errorsRemove(event.target.name);
    setData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleSendVerificationCode() {
    if (data.email === '' || !userValidator.isValidEmail(data.email)) {
      setErrors({
        email: ['Email inválido'],
      });
      return;
    }
    setIsLoading(true);
    const api = new UserApi();
    const response = await api.emailVerifyCode({ email: data.email });
    setIsLoading(false);
    if (!response.ok) {
      let message = 'Falha ao enviar o código.';
      if (response.status === 404) message = 'Email não encontrado';
      handleNotify({ type: 'error', message });
      return;
    }
    setErrors(undefined);
    handleNotify({ type: 'success', message: 'Código enviado' });
    setWasCodeSent(true);
  }

  async function verificationCodeSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setIsLoading(true);
    const api = new UserApi();
    const response = await api.emailVerify(data);
    setIsLoading(false);
    if (!response.ok) {
      setErrors({
        code: ['Código inválido'],
      });
      return;
    }
    setErrors(undefined);
    Token.set(response.data.token);
    navigate('/balance');
  }

  return (
    <VerificationCode
      title='Verifique seu Email'
      data={data}
      onChange={handleChange}
      sendVerificationCode={handleSendVerificationCode}
      verificationCodeSubmit={verificationCodeSubmit}
      wasCodeSent={wasCodeSent}
    />
  );
}
