import { useMemo } from 'react';
import styles from './styles.module.css';

export type TErrors = Record<string, string[]>;
type TWrapper = {
  label: string;
  name: string;
  required?: boolean;
  errors?: TErrors;
};
type Props = React.LabelHTMLAttributes<HTMLLabelElement> & TWrapper;

export function Wrapper({
  required,
  name,
  label,
  children,
  errors,
  className,
  ...props
}: Props) {
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
