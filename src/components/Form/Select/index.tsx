import { Wrapper, type TErrors } from '../Wrapper';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  errors?: TErrors;
};

export function Select({
  children,
  label,
  name,
  value,
  required,
  errors,
  ...props
}: Props) {
  return (
    <Wrapper label={label} name={name} required={required} errors={errors}>
      <select
        {...props}
        name={name}
        value={value}
        required={required}
        data-value={value}
      >
        {children}
      </select>
    </Wrapper>
  );
}
