import keyLocations from '@/data/KeyLocations.json';
import { useMemo } from 'react';

export function useFilteredLocations(searchQuery: string) {
  return useMemo(() => {
    return keyLocations.filter(location =>
      location.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
}
