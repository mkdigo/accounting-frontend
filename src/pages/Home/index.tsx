import {
  ShieldCheckIcon,
  ZapIcon,
  CheckIcon,
  Building2Icon,
  BookOpenIcon,
  ScrollTextIcon,
  UsersIcon,
  PiggyBankIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';

import styles from './styles.module.css';

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <nav className={styles.nav}>
        <Logo />
        <div>
          <Button
            color='transparent'
            textColor='white'
            onClick={() => navigate('/login')}
          >
            Entrar
          </Button>
          <Button onClick={() => navigate('/register')}>Comece grátis</Button>
        </div>
      </nav>
      <main className={styles.main}>
        <section className={styles.section}>
          <div>
            <h2 className={styles.subtitle}>
              🧠 CONTROLE FINANCEIRO INTELIGENTE
            </h2>
            <h1 className={styles.title}>
              Sua contabilidade
              <br />
              <span>simples, clara</span>
              <br />e sempre atualizada.
            </h1>
            <p>
              Crie sua conta, cadastre suas empresas e gerencie lançamentos
              contábeis com geração automática de relatórios — DRE, Balanço
              Patrimonial e etc. — por empresa.
            </p>
            <div className={styles.buttonsContainer}>
              <Button onClick={() => navigate('/register')}>
                Criar conta gratuita
              </Button>
              <Button color='transparent' onClick={() => navigate('/login')}>
                Ja tenho uma conta
              </Button>
            </div>
            <div className={styles.iconsContainer}>
              <span>
                <ShieldCheckIcon />
                Dados criptografados
              </span>
              <span>
                <ZapIcon /> Relatórios instantâneos
              </span>
              <span>
                <CheckIcon />
                Fácil de usar
              </span>
            </div>
          </div>
        </section>

        <section className={[styles.section, styles.gradient].join(' ')}>
          <div>
            <h2 className={styles.subtitle}>FUNCIONALIDADES</h2>
            <h1 className={styles.title}>
              Tudo que você precisa para controlar suas finanças.
            </h1>
            <p>
              Uma plataforma completa, do primeiro lançamento ao relatório final
              — sem instalar nada.
            </p>
            <div className={styles.cards}>
              <article>
                <header>
                  <div>
                    <Building2Icon />
                  </div>
                  <h3>Multi-empresa</h3>
                </header>
                <p>
                  Crie e gerencie quantas empresas quiser em uma única conta.
                  Cada empresa tem seu próprio plano de contas, lançamentos e
                  relatórios completamente isolados.
                </p>
              </article>
              <article>
                <header>
                  <div>
                    <BookOpenIcon />
                  </div>
                  <h3>Lançamentos contábeis</h3>
                </header>
                <p>
                  Registre débitos e créditos com histórico detalhado. O sistema
                  valida a partida dobrada automaticamente e organiza por
                  competência.
                </p>
              </article>
              <article>
                <header>
                  <div>
                    <ScrollTextIcon />
                  </div>
                  <h3>Relatórios automáticos</h3>
                </header>
                <p>
                  DRE, Balanço Patrimonial, dentre outros, gerados em segundos.
                  Filtre por período ou conta.
                </p>
              </article>
              <article>
                <header>
                  <div>
                    <ShieldCheckIcon />
                  </div>
                  <h3>Segurança e auditoria</h3>
                </header>
                <p>
                  Todas as alterações são registradas com log de auditoria. Seus
                  dados são criptografados e compartilhados somente com quem
                  você escolher.
                </p>
              </article>
              <article>
                <header>
                  <div>
                    <UsersIcon />
                  </div>
                  <h3>Colaboração em equipe</h3>
                </header>
                <p>
                  Convide contadores e colaboradores com permissões por empresa.
                  Controle quem pode lançar, revisar ou apenas visualizar.
                </p>
              </article>
              <article>
                <header>
                  <div>
                    <PiggyBankIcon />
                  </div>
                  <h3>Poupe dinheiro</h3>
                </header>
                <p>
                  Deixe de gastar dinheiro com sistemas caros, pesados e
                  difíceis de usar.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div>
            <h2 className={styles.subtitle}>COMECE HOJE</h2>
            <h1 className={styles.title}>
              Chega de planilhas.
              <br />
              Sua contabilidade
              <br />
              <span>merece mais.</span>
            </h1>
            <p>Experimente grátis enquanto ainda pode!</p>
            <div className={styles.buttonsContainer}>
              <Button onClick={() => navigate('/register')}>
                Criar conta gratuita
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div>
          <Logo mini />
          <p>
            Controle financeiro e contábil para qualquer empresa. Simples,
            rápido e confiável.
          </p>
        </div>
        <div>
          <span>© 2024 FinançasPro. Todos os direitos reservados.</span>
          <span>Rodrigo Yukio Mukudai · São Paulo, SP</span>
        </div>
      </footer>
    </>
  );
}
