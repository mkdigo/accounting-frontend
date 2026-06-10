import styles from './styles.module.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'primary' | 'secondary' | 'transparent' | 'danger' | 'link';
  textColor?: 'default' | 'white' | 'dark' | 'danger';
};

export function Button({
  children,
  className,
  color = 'primary',
  textColor = 'default',
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={[
        styles.button,
        styles[`color_${color}`],
        styles[`text_color_${textColor}`],
        className,
      ].join(' ')}
      type={type}
    >
      {children}
    </button>
  );
}
