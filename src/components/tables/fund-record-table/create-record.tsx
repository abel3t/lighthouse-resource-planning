'use client';

import useFundRecordStore from '@/stores/useFundRecordStore';
import useFundStore from '@/stores/useFundStore';
import useMemberStore from '@/stores/useMemberStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { FundRecordType } from '@prisma/client';
import { PlusIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { CommandList } from 'cmdk';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import removeAccents from 'remove-accents';
import { toast } from 'sonner';
import * as z from 'zod';

import { Icons } from '@/components/custom/icons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CurrencyInput, Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UploadButton } from '@/components/uploadthing';

import { deleteImageUploadThing } from '@/lib/api';
import { getErrorMessage } from '@/lib/handle-error';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

export function CreateFundRecordDialog() {
  const [open, setOpen] = useState(false);
  const [, startCreateTransition] = useTransition();
  const [isOnCreating, setIsOnCreating] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  const t = useTranslations();

  const createFundRecordSchema = z.object({
    amount: z.number().min(1000, { message: t('field_is_invalid', { field: t('amount') }) }),
    type: z.nativeEnum(FundRecordType),
    contributorId: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    date: z.date().optional(),
  });
  type CreateRecordSchema = z.infer<typeof createFundRecordSchema>;

  const form = useForm<CreateRecordSchema>({
    resolver: zodResolver(createFundRecordSchema),
    defaultValues: {
      amount: 0
    }
  });

  const queryParams = useFundRecordStore((state) => state.queryParams);
  const fetchFunds = useFundStore((state) => state.fetchFunds);
  const fetchRecords = useFundRecordStore((state) => state.fetchRecords);
  const fetchAllMembers = useMemberStore((state) => state.fetchAllMembers);

  const currentFund = useFundStore((state) => state.currentFund);

  useEffect(() => {
    fetchAllMembers();
  }, [fetchFunds, fetchAllMembers]);

  function onSubmit(input: CreateRecordSchema) {
    if (!currentFund) {
      toast('Please select a fund to create a record');
      return;
    }
    setIsOnCreating(true);

    startCreateTransition(() => {
      const amount = input.amount;

      toast.promise(
        axios.post('/api/fund-records', {
          ...input,
          image: fileUrl,
          fundId: currentFund.id,
          amount: input.type === FundRecordType.Expense ? -amount : amount
        }),
        {
          loading: t('create_record_processing', { name: t('fund_record').toLowerCase() }),
          success: () => {
            form.reset();
            setOpen(false);

            fetchFunds();
            fetchRecords(currentFund.id, queryParams);
            setIsOnCreating(false);
            setFileUrl(undefined);

            return t('create_record_successfully', { name: t('fund_record').toLowerCase() });
          },
          error: (error) => {
            setOpen(false);
            setIsOnCreating(false);

            if (fileUrl) {
              deleteImageUploadThing(fileUrl);
            }
            setFileUrl(undefined);

            console.log(getErrorMessage(error));

            return t('create_record_failed', { name: t('fund_record').toLowerCase() });
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
          setFileUrl(undefined);
          setIsOnCreating(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          {t('new_record')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{t('new_record')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <RecordTypeField form={form} t={t} />
              <GiveDayField form={form} t={t} />
            </div>
            <div className="flex items-start gap-2">
              <AmountField form={form} t={t} />

              <ContributorField form={form} t={t} />
            </div>

            <div className="flex items-start gap-2">
              {!fileUrl && (
                <UploadButton
                  endpoint="imageUploader"
                  content={{
                    button({ ready }) {
                      if (ready) return <div>{t('choose_image')}</div>;

                      return t('getting_ready');
                    },
                    allowedContent({ ready, isUploading }) {
                      if (!ready) {
                        return t('wait_a_moment');
                      }

                      if (isUploading) {
                        return t('uploading_image');
                      }

                      return t('max_image_size', { size: '8MB' });
                    }
                  }}
                  onClientUploadComplete={(res) => {
                    const file: any = res?.[0];

                    setFileUrl(file?.url || '');
                    setIsUploading(false);

                    toast.success(t('upload_image_successfully'));
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                    setIsUploading(false);
                  }}
                  onUploadBegin={(name) => {
                    setIsUploading(true);
                  }}
                />
              )}
              {fileUrl && (
                <AspectRatio ratio={16 / 9}>
                  <Image className="object-contain" src={fileUrl} fill alt="Image" />
                </AspectRatio>
              )}
            </div>

            <DescriptionField form={form} t={t} />

            <DialogFooter className="flex flex-row justify-end gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button className="w-24" type="button" variant="outline" disabled={isOnCreating || isUploading}>
                  {t('cancel')}
                </Button>
              </DialogClose>
              <Button className="flex w-24 justify-center" disabled={isOnCreating || isUploading}>
                {isOnCreating ? <Icons.spinner className="h-4 w-4 animate-spin" /> : t('submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const ContributorField = ({ form, t }: any) => {
  const members = useMemberStore((state) => state.allMembers);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name="contributorId"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('giver')}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? members.find((member) => member.id === field.value)?.name : t('search_giver')}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command
                filter={(value, search) => {
                  const member = members.find((x) => x.id === value);

                  return removeAccents(member?.name?.toLowerCase() || '').includes(
                    removeAccents(search.toLowerCase() || '')
                  )
                    ? 1
                    : 0;
                }}
              >
                <CommandInput placeholder={t('search_giver')} />
                <CommandList>
                  <ScrollArea className="h-72">
                    <CommandEmpty>{t('not_found')}</CommandEmpty>

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
                  </ScrollArea>
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

const DescriptionField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel>{t('note')}</FormLabel>
          <FormControl>
            <Textarea placeholder="Thông tin chi tiết..." className="resize-none" {...field} />
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
          <FormLabel className="my-0 py-0">{t('amount')}</FormLabel>
          <FormControl className="mt-0 py-0">
            <CurrencyInput className="mt-0 py-0" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const RecordTypeField = ({ form, t }: any) => {
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
          <FormLabel>Type</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder={`${t('income')}/${t('expense')}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={FundRecordType.Income}>{t(FundRecordType.Income.toLowerCase())}</SelectItem>
                <SelectItem value={FundRecordType.Expense}>{t(FundRecordType.Expense.toLowerCase())}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const GiveDayField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Date</FormLabel>
          <Popover modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? format(field.value, 'dd/MM/yyyy') : <span>{t('pick_a_date')}</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
