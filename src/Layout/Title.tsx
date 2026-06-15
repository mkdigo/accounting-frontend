import styles from './styles.module.css';

type Props = {
  children?: React.ReactNode;
  text: string;
  h2?: boolean;
  h3?: boolean;
  className?: string;
  print?: boolean;
};

export function Title({
  children,
  text,
  h2 = false,
  h3 = false,
  className,
  print = true,
}: Props) {
  return (
    <div
      className={[styles.title, print ? '' : styles.noPrint, className].join(
        ' '
      )}
    >
      {h3 ? <h3>{text}</h3> : h2 ? <h2>{text}</h2> : <h1>{text}</h1>}

      <div className={styles.tools}>{children}</div>
    </div>
  );
}
