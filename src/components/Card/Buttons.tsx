import styles from './styles.module.css';

type Props = {
  children?: React.ReactNode;
};

export function Buttons({ children }: Props) {
  return <div className={styles.buttons}>{children}</div>;
}
