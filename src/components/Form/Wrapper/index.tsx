import { useMemo } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import styles from './styles.module.css';

type TWrapper = {
  label: string;
  name: string;
  required?: boolean;
};
type Props = React.LabelHTMLAttributes<HTMLLabelElement> & TWrapper;

export function Wrapper({
  required,
  name,
  label,
  children,
  className,
  ...props
}: Props) {
  const { errors } = useAppContext();
  const error: string[] = useMemo(() => {
    return errors && Object.keys(errors).includes(name) ? errors[name] : [];
  }, [errors]);

  return (
    <label
      {...props}
      className={[
        styles.label,
        required ? styles.required : '',
        error.length > 0 ? styles.hasError : '',
        className,
      ].join(' ')}
    >
      <span>{label}</span>
      {children}
      {error.length > 0 && <small>{error.join(', ')}</small>}
    </label>
  );
}
