import styles from './styles.module.css';

type Props = {
  children?: React.ReactNode;
  title?: string;
  ref?: React.Ref<HTMLDivElement>;
};

export function Root({ children, title, ref }: Props) {
  return (
    <div className={styles.card} ref={ref}>
      {title && (
        <div className={styles.title}>
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}
