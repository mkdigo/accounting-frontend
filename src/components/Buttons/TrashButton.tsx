import { TrashIcon } from 'lucide-react';
import { Button, type ButtonProps } from '../Button';

type Props = Omit<ButtonProps, 'icon'>;

export function TrashButton({ title = 'Remover', ...rest }: Props) {
  return <Button title={title} color='danger' {...rest} icon={<TrashIcon />} />;
}
