import { SearchButton } from '../components/Buttons/SearchButton';

import styles from './styles.module.css';

type Props = {
  children?: React.ReactNode;
  onSubmit?: () => void;
  submitButtonShow?: boolean;
};

export function Filter({ children, onSubmit, submitButtonShow = true }: Props) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSubmit) return;
    onSubmit();
  }
  return (
    <section className={styles.filter}>
      <form onSubmit={handleSubmit}>
        <div>{children}</div>
        {submitButtonShow && onSubmit && (
          <div>
            <SearchButton type='submit' />
          </div>
        )}
      </form>
    </section>
  );
}
