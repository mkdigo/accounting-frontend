import { PlusIcon } from 'lucide-react';
import { Button, type ButtonProps } from '../Button';

type Props = Omit<ButtonProps, 'icon'>;

export function PlusButton({ title = 'Novo', ...rest }: Props) {
  return <Button title={title} color='primary' {...rest} icon={<PlusIcon />} />;
}
