import { Wrapper } from '../Wrapper';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
};

export function Select({
  children,
  label,
  name,
  value,
  required,
  ...props
}: Props) {
  return (
    <Wrapper label={label} name={name} required={required}>
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
