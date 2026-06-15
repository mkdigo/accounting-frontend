import { PrinterIcon } from 'lucide-react';
import { Button, type ButtonProps } from '../Button';

type Props = Omit<ButtonProps, 'icon'>;

export function PrintButton({ ...rest }: Props) {
  return (
    <Button
      onClick={() => window.print()}
      title='Imprimir'
      color='gray'
      {...rest}
      icon={<PrinterIcon />}
    />
  );
}
