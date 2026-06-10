import { useNavigate } from 'react-router';

import { useAppContext } from '../../hooks/useAppContext';
import { Button } from '../Button';

import styles from './styles.module.css';

type Props = React.FormHTMLAttributes<HTMLFormElement> & {
  submitButtonText?: string;
  submitButtonDisabled?: boolean;
  cancelButtonText?: string;
  cancelButtonShow?: boolean;
  cancelButtonAction?: 'closeModal' | 'navigateBack';
};

export function Form({
  children,
  submitButtonText,
  submitButtonDisabled = false,
  cancelButtonText,
  cancelButtonShow = true,
  cancelButtonAction = 'closeModal',
  ...props
}: Props) {
  const navigate = useNavigate();
  const { handleCloseModal } = useAppContext();

  return (
    <form className={styles.form} {...props}>
      {children}
      <div>
        {cancelButtonShow && (
          <Button
            color='danger'
            onClick={() =>
              cancelButtonAction === 'closeModal'
                ? handleCloseModal()
                : navigate(-1)
            }
          >
            {cancelButtonText ?? 'Cancelar'}
          </Button>
        )}

        <Button type='submit' color='primary' disabled={submitButtonDisabled}>
          {submitButtonText ?? 'Enviar'}
        </Button>
      </div>
    </form>
  );
}
