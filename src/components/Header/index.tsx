import { Logo } from '../Logo';

import styles from './styles.module.css';

type Props = {
  title?: string;
};

export function Header({ title = '' }: Props) {
  return (
    <header className={styles.header}>
      <Logo />

      <h1>{title}</h1>
    </header>
  );
}
