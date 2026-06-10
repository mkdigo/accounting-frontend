import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';

import { Logo } from '../../components/Logo';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Button';

import { useAppContext } from '../../hooks/useAppContext';
import { AuthApi, type TLoginInput } from '../../api/auth-api';
import { Token } from '../../utils/token';

import styles from './styles.module.css';

type TLocationState = {
  previusPath: string;
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoading } = useAppContext();

  const [data, setData] = useState<TLoginInput>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const api = new AuthApi();

    const response = await api.login(data);
    setIsLoading(false);

    if (!response.ok) {
      if (response.message === 'Unverified email')
        return navigate('/users/email-verify');
      setError(true);
      return;
    }

    let path = '/balance';
    if (location.state) {
      const { previusPath } = location.state as TLocationState;
      path = previusPath;
    }

    Token.set(response.data.token);
    navigate(path);
  };

  return (
    <main className={styles.main}>
      <section className={styles.left}>
        <header>
          <Logo />
        </header>

        <h1>Seu app de controle financeiro.</h1>

        <h2>
          Controle financeiro e contábil para qualquer empresa. Simples, rápido
          e confiável.
        </h2>

        <ul>
          <li>- Balanço Patrimonial</li>
          <li>- DRE</li>
          <li>- Controle de Estoque</li>
          <li>- Contas a pagar e receber</li>
          <li>- E muito mais</li>
        </ul>

        <p>Faça o login e desfrute.</p>
      </section>

      <section className={styles.right}>
        <div>
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <ul>
              <li>
                <Input
                  label='Usuário'
                  name='username'
                  value={data.username}
                  onChange={handleInputChange}
                  required
                />
              </li>
              <li>
                <Input
                  label='Senha'
                  name='password'
                  type='password'
                  value={data.password}
                  onChange={handleInputChange}
                  required
                />

                {error && (
                  <small className='error'>Usuário ou senha incorreta.</small>
                )}
              </li>
              <li>
                <Button type='submit'>Entrar</Button>
              </li>
            </ul>
          </form>
          <Link to='/users/password-reset'>Esqueci minha senha</Link>
        </div>
      </section>
    </main>
  );
}
