'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

import { DataTableFacetedFilter, FilterOption } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

type SearchField = {
  name: string;
  placeholder: string;
};

type Filter = {
  title: string;
  name: string;
  options: FilterOption[];
};

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  search: SearchField;
  filterFields: Filter[];
}

export function DataTableToolbar<TData>({
  table,
  search,
  filterFields,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const t = useTranslations();

  return (
    <div className={cn('flex items-center justify-between space-x-2 overflow-auto p-1', className)} {...props}>
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t(search.placeholder)}
          value={(table.getColumn(search.name)?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn(search.name)?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {filterFields.map(
          (field) =>
            table.getColumn(field.name) && (
              <DataTableFacetedFilter
                column={table.getColumn(field.name)}
                title={field.title}
                options={field.options}
              />
            )
        )}

        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            {t('clear_filters')}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
