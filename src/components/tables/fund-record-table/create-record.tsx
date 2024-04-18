'use client';

import useFundRecordStore from '@/stores/useFundRecordStore';
import useFundStore from '@/stores/useFundStore';
import useMemberStore from '@/stores/useMemberStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { FundRecordType } from '@prisma/client';
import { PlusIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { CommandList } from 'cmdk';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { getErrorMessage } from '@/lib/handle-error';
import { cn } from '@/lib/utils';

interface CreateTaskDialogProps {
  members: any[];
}

const createFundRecordSchema = z.object({
  amount: z.string().min(3, 'Số tiền không hợp lệ'),
  type: z.nativeEnum(FundRecordType),
  contributorId: z.string().optional(),
  description: z.string().optional()
});
export type CreateRecordSchema = z.infer<typeof createFundRecordSchema>;

export function CreateFundRecordDialog() {
  const [open, setOpen] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition();

  const form = useForm<CreateRecordSchema>({
    resolver: zodResolver(createFundRecordSchema)
  });

  const queryParams = useFundRecordStore((state) => state.queryParams);
  const fetchFunds = useFundStore((state) => state.fetchFunds);
  const fetchRecords = useFundRecordStore((state) => state.fetchRecords);
  const fetchMembers = useMemberStore((state) => state.fetchMembers);

  const currentFund = useFundStore((state) => state.currentFund);

  function onSubmit(input: CreateRecordSchema) {
    if (!currentFund) {
      toast('Please select a fund to create a record');
      return;
    }

    startCreateTransition(() => {
      const amount = parseFloat(input.amount);

      toast.promise(
        axios.post('/api/fund-record', {
          ...input,
          fundId: currentFund.id,
          amount: input.type === FundRecordType.Expense ? -amount : amount
        }),
        {
          loading: 'Creating record...',
          success: () => {
            form.reset();
            setOpen(false);

            fetchFunds();
            fetchRecords(queryParams);

            return 'Record created';
          },
          error: (error) => {
            setOpen(false);
            return getErrorMessage(error);
          }
        }
      );
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);

        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          New Record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Record</DialogTitle>
          <DialogDescription>Điền thông tin.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <RecordTypeField form={form} />

            <div className="flex items-start gap-2">
              <AmountField form={form} />

              <ContributorField form={form} />
            </div>

            <DescriptionField form={form} />

            <DialogFooter className="gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isCreatePending}>Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const ContributorField = ({ form }: any) => {
  const members = useMemberStore((state) => state.members);

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name="contributorId"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Người Dâng</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('min-w-[200px] justify-between', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? members.find((member) => member.id === field.value)?.name : 'Select contributor'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command>
                <CommandInput placeholder="Search Contributor..." />
                <CommandList>
                  <CommandEmpty>No contributor found.</CommandEmpty>

                  <CommandGroup>
                    {members.map((member) => (
                      <CommandItem
                        value={member.id}
                        key={member.id}
                        onSelect={() => {
                          form.setValue('contributorId', member.id);
                          setIsOpen(false);
                        }}
                      >
                        <Check
                          className={cn('mr-2 h-4 w-4', member.id === field.value ? 'opacity-100' : 'opacity-0')}
                        />
                        {member.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const DescriptionField = ({ form }: any) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel>Ghi chú</FormLabel>
          <FormControl>
            <Textarea placeholder="Thông tin chi tiết..." className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const AmountField = ({ form }: any) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel className="my-0 py-0">Số tiền</FormLabel>
          <FormControl className="mt-0 py-0">
            <Input className="mt-0 py-0" type="number" {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const RecordTypeField = ({ form }: any) => {
  const bgColor: Record<string, string> = {
    [FundRecordType.Income]: 'bg-green-400',
    [FundRecordType.Expense]: 'bg-red-400'
  };

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder="Thu/Chi" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={FundRecordType.Income}>{FundRecordType.Income}</SelectItem>
                <SelectItem value={FundRecordType.Expense}>{FundRecordType.Expense}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
