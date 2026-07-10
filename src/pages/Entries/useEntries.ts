import { useState } from 'react';
import { DateTime } from '@mkdigo/datetime';

import { type TEntry, type TEntrySearchParams } from '../../api/entry-api';

interface IUseEntries {
  filterData: TEntrySearchParams;
  setFilterData: React.Dispatch<React.SetStateAction<TEntrySearchParams>>;
  entries: TEntry[];
  setEntries: React.Dispatch<React.SetStateAction<TEntry[]>>;
}

const startDateTime = new DateTime();
startDateTime.subtractMonth(6);
startDateTime.setDay(1);
const endDateTime = new DateTime();

export function useEntries(): IUseEntries {
  const [filterData, setFilterData] = useState<TEntrySearchParams>({
    search: '',
    start: startDateTime.getDate(),
    end: endDateTime.getDate(),
  });
  const [entries, setEntries] = useState<TEntry[]>([]);

  return {
    filterData,
    setFilterData,
    entries,
    setEntries,
  };
}
