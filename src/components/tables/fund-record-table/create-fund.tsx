'use client';

import useFundStore from '@/stores/useFundStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { useLocale, useTranslations } from 'next-intl';
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
import { CurrencyInput, Input } from '@/components/ui/input';

import { getErrorMessage } from '@/lib/handle-error';

export function CreateFundDialog() {
  const [open, setOpen] = useState(false);
  const [, startCreateTransition] = useTransition();
  const [isOnCreating, setIsOnCreating] = useState(false);
  const t = useTranslations();

  const createFundSchema = z.object({
    name: z
      .string()
      .min(3, { message: t('field_must_contain_at_least_n_character_s', { field: t('fund'), amount: 3 }) }),
    amount: z.number().min(0, { message: t('field_is_invalid', { field: t('amount') }) })
  });
  type CreateFundSchema = z.infer<typeof createFundSchema>;

  const form = useForm<CreateFundSchema>({
    resolver: zodResolver(createFundSchema),
    defaultValues: {
      amount: 0
    }
  });

  const fetchFunds = useFundStore((state) => state.fetchFunds);

  function onSubmit(input: CreateFundSchema) {
    setIsOnCreating(true);

    startCreateTransition(() => {
      const amount = input.amount || 0;

      toast.promise(
        axios.post('/api/funds', {
          ...input,
          amount
        }),
        {
          loading: t('create_record_processing', { name: t('fund').toLowerCase() }),
          success: () => {
            form.reset();
            setOpen(false);

            fetchFunds();
            setIsOnCreating(false);

            return t('create_record_successfully', { name: t('fund').toLowerCase() });
          },
          error: (error) => {
            setOpen(false);
            setIsOnCreating(false);

            console.log(getErrorMessage(error));
            return t('create_record_failed', { name: t('fund').toLowerCase() });
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
            <p className="text-secondary">{t('create_fund')}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{t('create_fund')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <NameField form={form} />

            <AmountField form={form} t={t} />

            <DialogFooter className="flex flex-row justify-end gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button className="w-24" type="button" variant="outline" disabled={isOnCreating}>
                  {t('cancel')}
                </Button>
              </DialogClose>
              <Button className="flex w-24 justify-center" disabled={isOnCreating}>
                {isOnCreating ? <Icons.spinner className="h-4 w-4 animate-spin" /> : t('submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const NameField = ({ form }: any) => {
  const t = useTranslations();
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('fund_name')}</FormLabel>
          <FormControl>
            <Input placeholder={t('fund_name')} className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const AmountField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel className="my-0 py-0">{t('initial_balance')}</FormLabel>
          <FormControl className="mt-0 py-0">
            <CurrencyInput className="mt-0 py-0" {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
