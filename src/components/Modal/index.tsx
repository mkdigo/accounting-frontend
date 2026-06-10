import { type ReactNode, useContext, useEffect } from 'react';

import { AppContext } from '../../contexts/AppContext';

import styles from './styles.module.css';

interface ModalProps {
  children: ReactNode;
  name: string;
  title?: string;
  className?: string;
}

export function Modal({ children, name, title, className }: ModalProps) {
  const { handleCloseModal, currentModal } = useContext(AppContext);

  useEffect(() => {
    const handleClose = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') handleCloseModal();
    };

    window.addEventListener('keyup', handleClose);

    return () => {
      window.removeEventListener('keyup', handleClose);
    };
  }, [handleCloseModal]);

  if (name !== currentModal) return null;

  return (
    <div
      className={[styles.container, className].join(' ')}
      onClick={handleCloseModal}
    >
      <div
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          event.stopPropagation()
        }
      >
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
