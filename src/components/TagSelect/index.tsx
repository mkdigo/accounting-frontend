import { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';

import { Button } from '../Button';
import { Input } from '../Form/Input';

import { TagTranslations } from '../../translations/tag-translations';
import { useAppContext } from '../../hooks/useAppContext';
import {
  accountSubgroups,
  type TAccountCreateData,
  type TTagName,
} from '../../api/account-api';

import styles from './styles.module.css';

type Props = {
  onChange: (tags: TTagName[]) => void;
  data: TAccountCreateData;
};

export function TagSelect({ onChange, data }: Props) {
  const { lang } = useAppContext();
  const [tag, setTag] = useState<TTagName>();
  function handleClear() {
    setTag(undefined);
  }

  useEffect(() => {
    if (!tag) return;
    onChange([tag]);
  }, [tag]);

  return (
    <div className={styles.tag}>
      <XIcon className={styles.x} onClick={handleClear} />
      <Input
        label='Tags'
        name='tags'
        value={`${tag ? TagTranslations.name(tag)[lang] : ''}`}
        onChange={() => {}}
      />
      <div>
        {!tag &&
          data.subgroup &&
          accountSubgroups[data.subgroup].tags.map((tag, i) => (
            <Button
              color='transparent'
              textColor='dark'
              size='mini'
              onClick={() => setTag(tag)}
              key={`tag-button-${i}`}
            >
              {TagTranslations.name(tag)[lang]}
            </Button>
          ))}
      </div>
    </div>
  );
}
