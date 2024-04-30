'use client';

import useFundStore from '@/stores/useFundStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Icons } from '@/components/custom/icons';
import { Button } from '@/components/ui/button';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { getErrorMessage } from '@/lib/handle-error';

const createFundSchema = z.object({
  name: z.string().min(3, 'Tên quỹ quá ngắn'),
  amount: z.string().min(0, 'Số tiền không hợp lệ')
});
export type CreateFundSchema = z.infer<typeof createFundSchema>;

export function CreateFundDialog() {
  const [open, setOpen] = useState(false);
  const [, startCreateTransition] = useTransition();
  const [isOnCreating, setIsOnCreating] = useState(false);

  const form = useForm<CreateFundSchema>({
    resolver: zodResolver(createFundSchema)
  });

  const fetchFunds = useFundStore((state) => state.fetchFunds);
  const funds = useFundStore((state) => state.funds);

  function onSubmit(input: CreateFundSchema) {
    setIsOnCreating(true);

    startCreateTransition(() => {
      const amount = parseFloat(input.amount) || 0;

      toast.promise(
        axios.post('/api/funds', {
          ...input,
          amount
        }),
        {
          loading: 'Creating record...',
          success: () => {
            form.reset();
            setOpen(false);

            fetchFunds();
            setIsOnCreating(false);

            return 'Record created';
          },
          error: (error) => {
            setOpen(false);
            setIsOnCreating(false);

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
          console.log('reset form');
          setIsOnCreating(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <div className={'flex h-14 w-32 cursor-pointer items-center justify-center rounded-sm bg-slate-400 font-bold'}>
          <div className="flex flex-col justify-center  p-1 px-2">
            <p className="md:text-md align-center flex justify-center text-sm text-gray-600 lg:text-base">
              <PlusIcon />
            </p>
            <p className="text-secondary">Tạo Quỹ </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Create a Fund</DialogTitle>
          <DialogDescription>Điền thông tin.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <NameField form={form} />

            <AmountField form={form} />

            <DialogFooter className="gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isOnCreating}>
                  Cancel
                </Button>
              </DialogClose>
              <Button className="flex w-24 justify-center" disabled={isOnCreating}>
                {isOnCreating ? <Icons.spinner className="h-4 w-4 animate-spin" /> : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const NameField = ({ form }: any) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Tên Quỹ</FormLabel>
          <FormControl>
            <Input placeholder="Tên quỹ..." className="resize-none" {...field} />
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
          <FormLabel className="my-0 py-0">Số tiền ban đầu</FormLabel>
          <FormControl className="mt-0 py-0">
            <Input className="mt-0 py-0" type="number" {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
