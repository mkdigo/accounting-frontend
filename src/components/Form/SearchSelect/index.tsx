import { useEffect, useRef, useState } from 'react';
import { XIcon } from 'lucide-react';

import { Wrapper, type TErrors } from '../Wrapper';

import { useOnKeyUp } from '../../../hooks/useOnKeyUp';

import styles from './styles.module.css';

type TListItem = {
  label: string;
  value: string | number;
};

type Props = {
  label: string;
  name: string;
  errors?: TErrors;
  list: TListItem[];
  onChange?: (value: string | null) => void;
  required?: boolean;
  value?: string | number;
};

let isFocused: boolean = false;

export function SearchSelect({
  label,
  name,
  required,
  errors,
  list,
  onChange,
}: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filteredList, setFilteredList] = useState<TListItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [showList, setShowList] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TListItem | null>(null);

  // list resize
  useEffect(() => {
    const container = document.querySelector('#layout-container');

    if (!container) return;

    function listResize() {
      if (!listRef.current?.parentElement) return;

      const inputBounding =
        listRef.current.parentElement.getBoundingClientRect();

      // padding-top 6px
      const list = {
        position: {
          x: inputBounding.left,
          y: inputBounding.bottom + 6,
        },
        size: {
          width: listRef.current.offsetWidth,
          height: listRef.current.offsetHeight,
        },
      };

      // max-height 300px
      const diff = window.innerHeight - (list.position.y + 300);

      if (diff < 0) {
        const newHeight = 300 + diff - 16;

        if (newHeight > 150) {
          listRef.current.style.top = `${inputBounding.height + 6}px`;
          listRef.current.style.height = `${newHeight}px`;
        } else {
          listRef.current.style.top = `-306px`;
          listRef.current.style.height = `300px`;
        }
      }
    }

    listResize();

    container.addEventListener('scroll', listResize);

    return () => {
      container.removeEventListener('scroll', listResize);
    };
  }, []);

  useEffect(() => {
    setFilteredList(list);
  }, [list]);

  useEffect(() => {
    setSearch(selectedItem?.label ?? '');
    if (onChange) onChange(selectedItem ? String(selectedItem.value) : null);
  }, [selectedItem]);

  useOnKeyUp(() => {
    const data = search.trim();

    if (selectedItem && selectedItem.label !== search) {
      setSelectedItem(null);
      setShowList(true);
    }

    if (data === '') {
      setFilteredList(list);
      return;
    }

    const filter = list.filter((item) => {
      const regex = new RegExp(data, 'gi');
      return regex.test(item.label);
    });

    setFilteredList(filter);
  }, searchInputRef);

  function handleSelect(item: TListItem) {
    setSelectedItem(item);
    setShowList(false);
  }

  function handleFocus() {
    if (showList === false && !selectedItem) setShowList(true);
    isFocused = true;
  }

  function handleBlur() {
    isFocused = false;
    setTimeout(() => {
      if (isFocused) return;

      setShowList(false);

      if (!selectedItem) {
        setSearch('');
        setFilteredList(list);
      }
    }, 300);
  }

  function handleClean() {
    setSelectedItem(null);
  }

  return (
    <Wrapper
      label={label}
      name={name}
      required={required}
      errors={errors}
      className={styles.wrapper}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <input
        type='text'
        name={name}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        required={required}
        placeholder=' '
        ref={searchInputRef}
      />
      {search !== '' && <XIcon onClick={handleClean} />}
      {showList && (
        <ul className={styles.list} ref={listRef}>
          {filteredList.map((item, i) => (
            <li
              tabIndex={0}
              key={`item-${i}`}
              onClick={() => handleSelect(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSelect(item);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}
