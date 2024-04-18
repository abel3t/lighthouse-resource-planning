'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
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
import { Textarea } from '@/components/ui/textarea';

import { createFundRecord } from '@/lib/api';
import { getErrorMessage } from '@/lib/handle-error';
import { cn } from '@/lib/utils';

interface CreateTaskDialogProps {
  members: any[];
}

const createFundRecordSchema = z.object({
  amount: z.string(),
  contributorId: z.string(),
  description: z.string()
});
export type CreateRecordSchema = z.infer<typeof createFundRecordSchema>;

export function CreateFundRecordDialog({ members }: CreateTaskDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition();

  const form = useForm<CreateRecordSchema>({
    resolver: zodResolver(createFundRecordSchema)
  });
  function onSubmit(input: CreateRecordSchema) {
    startCreateTransition(() => {
      toast.promise(
        axios.post('/api/fund-record', {
          ...input,
          amount: parseFloat(input.amount),
          type: 'Income'
        }),
        {
          loading: 'Creating record...',
          success: () => {
            form.reset();
            setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          New Record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>Fill in the details below to create a new record.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="contributorId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Language</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn('w-[200px] justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value
                            ? members.find((member) => member.id === field.value)?.name
                            : 'Select contributor'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search Contributor..." />
                        <CommandEmpty>No contributor found.</CommandEmpty>
                        <CommandList>
                          {members.map((member) => (
                            <CommandItem
                              value={member.id}
                              key={member.id}
                              onSelect={() => {
                                form.setValue('contributorId', member.id);
                              }}
                            >
                              <Check
                                className={cn('mr-2 h-4 w-4', member.id === field.value ? 'opacity-100' : 'opacity-0')}
                              />
                              {member.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>This is the language that will be used in the dashboard.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
