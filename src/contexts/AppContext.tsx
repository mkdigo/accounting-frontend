import { createContext, startTransition, useOptimistic, useState } from 'react';
import { Loader } from '../components/Loader';
import {
  Notifications,
  type TAppNotification,
} from '../components/Notifications';
import { type TCompany } from '../api/company-api';
import { Company } from '../utils/company';

export type TErrors = Record<string, string[]>;
type TErrorsAppendInput = {
  key: string;
  errors: string[];
};

export type FormState<T> = {
  data?: T;
  errors?: TErrors;
} | void;

type TLang = 'ptBR';

type TAppContext = {
  lang: TLang;
  setLang: React.Dispatch<React.SetStateAction<TLang>>;
  errors: TErrors | undefined;
  setErrors: React.Dispatch<React.SetStateAction<TErrors | undefined>>;
  errorsAppend: (input: TErrorsAppendInput) => void;
  errorsRemove: (key: string) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isTransitionLoading: boolean;
  setIsTransitionLoading: (action: boolean) => void;
  loader: (callback: () => Promise<void>) => void;
  currentModal: string | null;
  handleOpenModal: (name: string) => void;
  handleCloseModal: () => void;
  handleNotify: (notification: TAppNotification) => void;
  companies: TCompany[];
  setCompanies: React.Dispatch<React.SetStateAction<TCompany[]>>;
  currentCompany: TCompany | undefined;
  changeCurrentCompany: (data: string | TCompany) => void;
};

export const AppContext = createContext<TAppContext>({} as TAppContext);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<TLang>('ptBR');
  const [errors, setErrors] = useState<TErrors>();
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitionLoading, setIsTransitionLoading] = useOptimistic(
    false,
    (_currentState, newValue: boolean) => newValue,
  );
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<TAppNotification[]>([]);
  const [companies, setCompanies] = useState<TCompany[]>([]);
  const [currentCompany, setCurrentCompany] = useState<TCompany>();

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

  function errorsAppend({ key, errors }: TErrorsAppendInput): void {
    setErrors((prev) => ({
      ...prev,
      [key]: errors,
    }));
  }

  function errorsRemove(key: string): void {
    if (errors && Object.keys(errors).includes(key)) {
      setErrors((prev) => {
        let updatedErrors = { ...prev };
        delete updatedErrors[key];
        return updatedErrors;
      });
    }
  }

  function handleOpenModal(name: string): void {
    setCurrentModal(name);
  }

  function handleCloseModal(): void {
    setErrors(undefined);
    setCurrentModal(null);
  }

  function handleNotify(notification: TAppNotification): void {
    setNotifications((prev) => [...prev, notification]);
  }

  function handleRemoveNotification(index: number): void {
    const n = [...notifications];
    n.splice(index, 1);
    setNotifications(n);
  }

  async function loader(callback: () => Promise<void>) {
    startTransition(async () => {
      setIsTransitionLoading(true);
      await callback();
    });
  }

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        errors,
        setErrors,
        errorsAppend,
        errorsRemove,
        isLoading,
        setIsLoading,
        isTransitionLoading,
        setIsTransitionLoading,
        loader,
        currentModal,
        handleOpenModal,
        handleCloseModal,
        handleNotify,
        companies,
        setCompanies,
        currentCompany,
        changeCurrentCompany,
      }}
    >
      {children}
      {(isLoading || isTransitionLoading) && <Loader />}
      <Notifications
        notifications={notifications}
        removeNotification={handleRemoveNotification}
      />
    </AppContext.Provider>
  );
}
