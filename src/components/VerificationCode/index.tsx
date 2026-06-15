import type { TVerificationCodeData } from '../../api/user-api';
import { Button } from '../Button';
import { Form } from '../Form';
import { Input } from '../Form/Input';
import { Header } from '../Header';

import styles from './styles.module.css';

type Props = {
  title: string;
  data: TVerificationCodeData;
  wasCodeSent: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sendVerificationCode: () => void;
  verificationCodeSubmit: (event: React.SubmitEvent) => void;
};

export function VerificationCode({
  title,
  data,
  wasCodeSent,
  onChange,
  sendVerificationCode,
  verificationCodeSubmit,
}: Props) {
  function handleSendVerificationCodeSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    sendVerificationCode();
  }
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1>{title}</h1>

        {!wasCodeSent ? (
          <>
            <p>Informe seu Email</p>
            <Form
              cancelButtonShow={false}
              submitButtonText='Próximo'
              onSubmit={handleSendVerificationCodeSubmit}
            >
              <Input
                label='Email'
                name='email'
                value={data.email}
                onChange={onChange}
                required
              />
            </Form>
          </>
        ) : (
          <Form cancelButtonShow={false} onSubmit={verificationCodeSubmit}>
            <p>Um código de verificação foi enviado ao seu e-mail.</p>
            <Input
              label='Código'
              name='code'
              value={data.code}
              onChange={onChange}
              autoComplete='one-time-code'
              required
            />
            <Button
              className={styles.newCode}
              color='link'
              onClick={sendVerificationCode}
            >
              Enviar o código novamente
            </Button>
          </Form>
        )}
      </main>
    </>
  );
}
