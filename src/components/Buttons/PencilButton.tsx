import { PencilIcon } from 'lucide-react';
import { Button, type ButtonProps } from '../Button';

type Props = Omit<ButtonProps, 'icon'>;

export function PencilButton({ title = 'Editar', ...rest }: Props) {
  return <Button title={title} color='gray' {...rest} icon={<PencilIcon />} />;
}
