import styles from './styles.module.css';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'primary' | 'secondary' | 'transparent' | 'danger' | 'link' | 'gray';
  textColor?: 'default' | 'white' | 'dark' | 'danger';
  icon?: React.ReactElement;
  size?: 'default' | 'medium' | 'mini';
};

export function Button({
  children,
  className,
  color = 'primary',
  textColor = 'default',
  type = 'button',
  icon,
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        styles.button,
        styles[`color_${color}`],
        styles[`text_color_${textColor}`],
        styles[`size_${size}`],
        className,
      ].join(' ')}
      type={type}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}
