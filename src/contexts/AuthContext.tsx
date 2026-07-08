import { createContext, useEffect, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { CompanyApi, type TCompany } from '../api/company-api';
import { AccountApi, type TAccount } from '../api/account-api';
import { Company } from '../utils/company';
import { Token } from '../utils/token';
import { router } from '../router';

type TAuthContext = {
  loadData: () => void;
  companies: TCompany[];
  setCompanies: React.Dispatch<React.SetStateAction<TCompany[]>>;
  currentCompany: TCompany | undefined;
  changeCurrentCompany: (data: string | TCompany) => void;
  accounts: TAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<TAccount[]>>;
};

export const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleNotify } = useAppContext();
  const [loadDataIndex, setLoadDataIndex] = useState<number>(0);
  const [companies, setCompanies] = useState<TCompany[]>([]);
  const [currentCompany, setCurrentCompany] = useState<TCompany>();
  const [accounts, setAccounts] = useState<TAccount[]>([]);

  function loadCompanies(): CompanyApi {
    const api = new CompanyApi();
    (async () => {
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
        router.navigate('/companies');
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
    })();
    return api;
  }

  useEffect(() => {
    if (!Token.get()) return;
    const api = loadCompanies();

    return () => {
      api.abort();
    };
  }, [loadDataIndex]);

  useEffect(() => {
    if (!currentCompany) return;
    const accountApi = new AccountApi();
    (async () => {
      const response = await accountApi.list(currentCompany.id);

      if (response.ok) setAccounts(response.data.accounts);
    })();
    return () => {
      accountApi.abort();
    };
  }, [currentCompany]);

  function loadData(): void {
    setLoadDataIndex((prev) => prev + 1);
  }

  function changeCurrentCompany(data: string | TCompany) {
    if (typeof data === 'object') {
      setCurrentCompany(data);
      Company.setCompanyId(data.id);
      return;
    }

    const filter = companies.filter((company) => company.id === data);
    if (filter.length === 0) {
      setCurrentCompany(undefined);
      Company.removeCompanyId();
      return;
    }
    setCurrentCompany(filter[0]);
    Company.setCompanyId(filter[0].id);
  }

  return (
    <AuthContext.Provider
      value={{
        loadData,
        companies,
        setCompanies,
        currentCompany,
        changeCurrentCompany,
        accounts,
        setAccounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
