import { useState, useRef, useEffect, type ChangeEvent, useMemo } from 'react';

import { Wrapper } from '../Wrapper';

import styles from './styles.module.css';

type TOption = {
  value: string;
  label: string;
};

type TOnChangeProps = {
  name: string;
  value: string;
};

type TProps = {
  options: TOption[];
  label: string;
  name: string;
  value?: string;
  onChange?: (props: TOnChangeProps) => void;
  required?: boolean;
};

export function SelectWithFilter({
  options,
  label,
  name,
  value,
  onChange,
  required = false,
}: TProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<TOption>();

  const containerRef = useRef<HTMLLabelElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const filteredOptions: TOption[] = useMemo(() => {
    return options.filter((option) => {
      const split = filter.split(' ');
      let regexString = '^';
      for (let i = 0; i < split.length; i++) {
        if (i > 0) regexString += '.+';
        regexString += split[i];
      }
      const regex = new RegExp(regexString, 'gi');
      if (selectedOption) return option;
      return regex.test(option.label);
    });
  }, [filter, options]);

  useEffect(() => {
    const foundOption = options.filter((item) => item.value === value)[0];
    if (!foundOption) {
      setFilter('');
      setSelectedOption(undefined);
      return;
    }
    setFilter(foundOption.label);
    setSelectedOption(foundOption);
  }, [value]);

  const foundOption: TOption | undefined = useMemo(() => {
    return options.filter((item) => item.label === filter)[0];
  }, [filter]);

  useEffect(() => {
    setSelectedOption(foundOption);
    if (!onChange) return;
    onChange({
      name,
      value: foundOption ? foundOption.value : '',
    });
    if (foundOption) setIsOpen(false);
  }, [foundOption]);

  const handleSelect = (option: TOption): void => {
    setFilter(option.label);
    setIsOpen(false);
  };

  function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
    setFilter(e.target.value);
    if (!isOpen) setIsOpen(true);
  }

  function toggleDropdown(): void {
    setIsOpen((prev) => {
      if (prev && !selectedOption) setFilter('');
      return !prev;
    });
  }

  function handleFocus(): void {
    if (!selectedOption) setIsOpen(true);
  }

  function handleBlur(event: React.FocusEvent): void {
    if (containerRef.current?.contains(event.relatedTarget)) return;
    if (containerRef.current?.contains(dropdownRef.current)) toggleDropdown();
  }

  return (
    <Wrapper
      ref={containerRef}
      name={name}
      label={label}
      className={styles.container}
      onBlur={handleBlur}
    >
      <input
        name={name}
        value={filter}
        onChange={handleInputChange}
        onFocus={handleFocus}
        required={required}
        placeholder=' '
      />
      <div className={styles.arrow} onClick={toggleDropdown}>
        {isOpen ? '▲' : '▼'}
      </div>

      {isOpen && (
        <ul ref={dropdownRef} className={styles.dropdown}>
          {filteredOptions.map((option) => (
            <li
              tabIndex={0}
              key={`select-${option.value}`}
              className={`${selectedOption?.value === option.value ? styles.selected : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSelect(option);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}
