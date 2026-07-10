import { MinusIcon } from 'lucide-react';
import { Button, type ButtonProps } from '../Button';

type Props = Omit<ButtonProps, 'icon'>;

export function MinusButton({ title = 'Novo', ...rest }: Props) {
  return (
    <Button title={title} color='primary' {...rest} icon={<MinusIcon />} />
  );
}
