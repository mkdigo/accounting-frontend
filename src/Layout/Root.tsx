import { SideBar } from '../components/SideBar';

import styles from './styles.module.css';

type Props = {
  children: React.ReactNode;
  printHeader?: boolean;
};

export function Root({ children, printHeader = true }: Props) {
  return (
    <main className={styles.main}>
      <SideBar printHeader={printHeader} />
      <div className={styles.container} id='layout-container'>
        {children}
      </div>
    </main>
  );
}
