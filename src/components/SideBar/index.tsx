import { useState } from 'react';
import {
  Link,
  useMatch,
  useResolvedPath,
  useNavigate,
  type LinkProps,
} from 'react-router';
import { MenuIcon } from 'lucide-react';

import { useAppContext } from '../../hooks/useAppContext';

import { AuthApi } from '../../api/auth-api';
import { Token } from '../../utils/token';
import { Logo } from '../Logo';
import { Button } from '../Button';

import styles from './styles.module.css';

function CustomLink({ children, to, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link className={match ? styles.currentPage : ''} to={to} {...props}>
      {children}
    </Link>
  );
}

type Props = {
  printHeader?: boolean;
};

export function SideBar({ printHeader = true }: Props) {
  const {
    setIsLoading,
    handleNotify,
    companies,
    currentCompany,
    changeCurrentCompany,
  } = useAppContext();
  const navigate = useNavigate();
  const [menuActived, setMenuActived] = useState<boolean>(false);

  function handleMenuToggle(): void {
    setMenuActived(!menuActived);
  }

  async function logout(): Promise<void> {
    setIsLoading(true);
    const api = new AuthApi();
    const response = await api.logout();
    setIsLoading(false);

    if (!response.ok) {
      handleNotify({
        type: 'error',
        message: 'Algo de errado aconteceu, tente novamente.',
      });
      return;
    }

    Token.remove();
    navigate('/login');
  }

  function handleCompanySelect(event: React.ChangeEvent<HTMLSelectElement>) {
    changeCurrentCompany(event.target.value);
  }

  return (
    <nav
      className={[
        styles.container,
        menuActived ? styles.menuActived : '',
        printHeader ? '' : styles.noPrint,
      ].join(' ')}
    >
      <h2>
        <Logo />
      </h2>

      <Button
        color='transparent'
        className={styles.menuIcon}
        onClick={handleMenuToggle}
      >
        <MenuIcon />
      </Button>

      <ul
        className={menuActived ? styles.menuActived : ''}
        onClick={() => setMenuActived(false)}
      >
        <li>
          <select
            onClick={(e) => e.stopPropagation()}
            onChange={handleCompanySelect}
            value={currentCompany?.id}
          >
            {companies.map((company) => (
              <option value={company.id} key={`sidebar-company-${company.id}`}>
                {company.name}
              </option>
            ))}
          </select>
        </li>
        <li>
          <CustomLink to='/balance'>Balanço Patrimonial</CustomLink>
        </li>
        <li>
          <CustomLink to='/companies'>Empresas</CustomLink>
        </li>
        <li>
          <button onClick={logout}>Sair</button>
        </li>
      </ul>
    </nav>
  );
}
