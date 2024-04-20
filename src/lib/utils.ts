import { SortType } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const searchParamsParser = (url: string) => {
  const fallbackRes = {
    search: '',
    page: 1,
    pageSize: 10,
    sortField: '',
    sortOrder: 'desc',
    fundId: ''
  };

  if (!url) {
    fallbackRes;
  }

  const searchParams = new URL(url)?.searchParams;

  if (!searchParams) {
    return fallbackRes;
  }

  const s = new URLSearchParams(searchParams);
  const [sortField, sortOrder] = (s.get('sort') as string)?.split('.');

  return {
    search: s.get('search'),
    page: (parseInt(s.get('page') || '') as number) || 1,
    pageSize: (parseInt(s.get('pageSize') || '') as number) || 10,
    sortField: sortField as string,
    sortOrder: (['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc') as SortType,
    fundId: s.get('fundId') || ''
  };
};
