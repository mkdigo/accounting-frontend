import styles from './styles.module.css';

type Props = {
  label?: string;
  content: string | number | null;
};

export function Row({ label, content }: Props) {
  return (
    <div className={styles.row}>
      {label && <span className={styles.label}>{label}:</span>}
      <span>{content}</span>
    </div>
  );
}
