import { useEffect } from 'react';
import { XIcon, CheckIcon, TriangleAlertIcon } from 'lucide-react';

import styles from './styles.module.css';

export type TAppNotification = {
  type: 'error' | 'warning' | 'success';
  message: string;
};

type Props = {
  notifications: TAppNotification[];
  removeNotification: (index: number) => void;
};

export function Notifications({ notifications, removeNotification }: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].type === 'success') {
          removeNotification(i);
          break;
        }
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [notifications]);

  return (
    <section className={styles.container}>
      {notifications.map((notification, i) => (
        <div
          className={[styles.notification, styles[notification.type]].join(' ')}
          key={`error-${i}`}
        >
          {notification.type === 'success' ? (
            <CheckIcon />
          ) : (
            <TriangleAlertIcon />
          )}
          <span>{notification.message}</span>
          <div onClick={() => removeNotification(i)}>
            <XIcon />
          </div>
        </div>
      ))}
    </section>
  );
}
