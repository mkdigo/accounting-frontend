import { useState } from 'react';
import { Wrapper } from '../Wrapper';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  innerRef?: React.ForwardedRef<HTMLInputElement | null>;
};

export function Input({
  label,
  name,
  value,
  type = 'text',
  required,
  innerRef,
  ...inputProps
}: Props) {
  const [passwordShow, setPasswordShow] = useState(false);
  return (
    <Wrapper label={label} name={name} required={required}>
      <input
        {...inputProps}
        type={type !== 'password' ? type : passwordShow ? 'text' : 'password'}
        name={name}
        value={value}
        required={required}
        placeholder=' '
        ref={innerRef}
      />
      {type === 'password' &&
        (!passwordShow ? (
          <EyeClosedIcon onClick={() => setPasswordShow(true)} />
        ) : (
          <EyeIcon onClick={() => setPasswordShow(false)} />
        ))}
    </Wrapper>
  );
}
