import styles from './styles.module.css';

type RootProps = {
  children: React.ReactNode;
};

function Root({ children }: RootProps) {
  return (
    <table className={styles.table}>
      <tbody>{children}</tbody>
    </table>
  );
}

type RowProps = {
  label?: string;
  content?: string | number | null;
  children?: React.ReactNode;
};

function Row({ label, content, children }: RowProps) {
  return (
    <tr>
      {label && <td className={styles.label}>{label}:</td>}
      <td>{children ?? content}</td>
    </tr>
  );
}

export const Table = {
  Root,
  Row,
};
