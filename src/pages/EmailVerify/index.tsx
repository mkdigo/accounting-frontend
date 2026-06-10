import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import type { TErrors } from '../../components/Form/Wrapper';
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
  const { setIsLoading, handleNotify } = useAppContext();
  const [data, setData] = useState<TVerificationCodeData>({
    email: location.state?.email ?? '',
    code: '',
  });
  const [wasCodeSent, setWasCodeSent] = useState<boolean>(
    location.state?.email ? true : false,
  );
  const [errors, setErrors] = useState<TErrors>({});

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (Object.keys(errors).includes(event.target.name)) {
      setErrors((prev) => {
        let updatedErrors = { ...prev };
        delete updatedErrors[event.target.name];
        return updatedErrors;
      });
    }
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
    Token.set(response.data.token);
    navigate('/balance');
  }

  return (
    <VerificationCode
      title='Verifique seu Email'
      data={data}
      errors={errors}
      onChange={handleChange}
      sendVerificationCode={handleSendVerificationCode}
      verificationCodeSubmit={verificationCodeSubmit}
      wasCodeSent={wasCodeSent}
    />
  );
}
