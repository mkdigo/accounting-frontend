import { EyeIcon } from 'lucide-react';
import { Button, type ButtonProps } from '../Button';

type Props = Omit<ButtonProps, 'icon'>;

export function EyeButton({ title = 'Vizualizar', ...rest }: Props) {
  return <Button title={title} color='gray' {...rest} icon={<EyeIcon />} />;
}
