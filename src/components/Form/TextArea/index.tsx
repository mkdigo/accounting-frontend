import { Wrapper, type TErrors } from '../Wrapper';

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  errors?: TErrors;
};

export function TextArea({
  label,
  name,
  value,
  onChange,
  required,
  errors,
}: Props) {
  return (
    <Wrapper label={label} name={name} required={required} errors={errors}>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=' '
      />
    </Wrapper>
  );
}
