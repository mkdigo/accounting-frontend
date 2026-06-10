import { createContext, useState } from 'react';
import { Loader } from '../components/Loader';
import {
  Notifications,
  type TAppNotification,
} from '../components/Notifications';

type TAppContext = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentModal: string | null;
  handleOpenModal: (name: string) => void;
  handleCloseModal: () => void;
  handleNotify: (notification: TAppNotification) => void;
};

export const AppContext = createContext<TAppContext>({} as TAppContext);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<TAppNotification[]>([]);

  function handleOpenModal(name: string): void {
    setCurrentModal(name);
  }

  function handleCloseModal(): void {
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
  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        currentModal,
        handleOpenModal,
        handleCloseModal,
        handleNotify,
      }}
    >
      {children}
      {isLoading && <Loader />}
      <Notifications
        notifications={notifications}
        removeNotification={handleRemoveNotification}
      />
    </AppContext.Provider>
  );
}
