import { CircleDollarSignIcon } from 'lucide-react';

import styles from './style.module.css';

type Props = {
  mini?: boolean;
};

export function Logo({ mini = false }: Props) {
  let className: string[] = [styles.logo];
  if (mini) className.push(styles.mini);

  return (
    <div className={className.join(' ')}>
      <span>
        <CircleDollarSignIcon size={mini ? 20 : undefined} />
      </span>
      <strong>AccountingPro</strong>
    </div>
  );
}
