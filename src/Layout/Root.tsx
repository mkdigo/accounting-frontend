import { useEffect } from 'react';

import { SideBar } from '../components/SideBar';

import { CompanyApi } from '../api/company-api';
import { useAppContext } from '../hooks/useAppContext';
import { Company } from '../utils/company';

import styles from './styles.module.css';
import { useNavigate } from 'react-router';

type Props = {
  children: React.ReactNode;
  printHeader?: boolean;
};

export function Root({ children, printHeader = true }: Props) {
  const { loader, handleNotify, setCompanies, changeCurrentCompany } =
    useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const api = new CompanyApi();
    loader(async () => {
      const response = await api.listByUserId();
      if (!response.ok) {
        if (!response.isAborted)
          handleNotify({
            type: 'error',
            message: 'Erro ao carregar as empresas',
          });
        return;
      }
      const companies = response.data.companies;
      setCompanies(companies);
      if (companies.length === 0) {
        Company.removeCompanyId();
        navigate('/companies');
        return;
      }
      const selectedCompanyId = Company.getCompanyId();
      const filter = companies.filter(
        (company) => company.id === selectedCompanyId,
      );
      if (filter.length === 0) {
        changeCurrentCompany(companies[0]);
      } else {
        changeCurrentCompany(filter[0]);
      }
    });
    return () => {
      api.abort();
    };
  }, []);
  return (
    <main className={styles.main}>
      <SideBar printHeader={printHeader} />
      <div className={styles.container} id='layout-container'>
        {children}
      </div>
    </main>
  );
}
