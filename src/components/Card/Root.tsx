import styles from './styles.module.css';

type Props = {
  children?: React.ReactNode;
  title?: string;
};

export function Root({ children, title }: Props) {
  return (
    <div className={styles.card}>
      {title && (
        <div className={styles.title}>
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}
