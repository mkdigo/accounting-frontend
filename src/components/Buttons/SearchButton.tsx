import { SearchIcon } from 'lucide-react';
import { Button, type ButtonProps } from '../Button';

type Props = Omit<ButtonProps, 'icon'>;

export function SearchButton({
  title = 'Buscar',
  type = undefined,
  ...rest
}: Props) {
  return <Button title={title} color='gray' {...rest} icon={<SearchIcon />} />;
}
