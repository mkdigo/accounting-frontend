import { Wrapper } from '../Wrapper';

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
};

export function TextArea({ label, name, value, onChange, required }: Props) {
  return (
    <Wrapper label={label} name={name} required={required}>
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
