'use client';

import { DiscipleshipProcess, Gender, PersonalType } from '@/enums';
import useAccountStore from '@/stores/useAccountStore';
import useMemberStore from '@/stores/useMemberStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { CommandList } from 'cmdk';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Icons } from '@/components/custom/icons';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Input, PhoneInput } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { client } from '@/lib/client';
import { getErrorMessage } from '@/lib/handle-error';
import { cn } from '@/lib/utils';

export function CreateMemberDialog() {
  const [open, setOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isOnCreating, setIsOnCreating] = React.useState(false);
  const [, startCreateTransition] = React.useTransition();
  const t = useTranslations();

  const createMemberSchema = z.object({
    name: z
      .string()
      .min(3, { message: t('field_must_contain_at_least_n_character_s', { field: t('name'), amount: 3 }) }),
    discipleshipProcess: z.nativeEnum(DiscipleshipProcess),
    curatorId: z.string().optional(),
    friendId: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    birthday: z.date().optional(),
    memberDay: z.date().optional(),
    hometown: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    description: z.string().optional()
  });
  type CreateRecordSchema = z.infer<typeof createMemberSchema>;

  const form = useForm<CreateRecordSchema>({
    resolver: zodResolver(createMemberSchema)
  });

  const queryParams = useMemberStore((state) => state.queryParams);
  const fetchMembers = useMemberStore((state) => state.fetchMembers);

  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  function onSubmit(input: CreateRecordSchema) {
    setIsOnCreating(true);

    startCreateTransition(() => {
      const type = PersonalType.Member;

      toast.promise(
        client.post('/members', {
          ...input,
          type
        }),
        {
          loading: t('create_record_processing', { name: t('member').toLowerCase() }),
          success: () => {
            form.reset();
            setOpen(false);
            setIsOnCreating(false);

            fetchMembers(queryParams);

            return t('create_record_successfully', { name: t('member').toLowerCase() });
          },
          error: (error) => {
            setOpen(false);
            setIsOnCreating(false);
            console.log(getErrorMessage(error));

            return t('create_record_failed', { name: t('member').toLowerCase() });
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
              <NameField form={form} t={t} />
              <DiscipleshipProcessField form={form} t={t} />
            </div>

            <div className="flex items-start gap-2">
              <CuratorField form={form} t={t} />
              <IntroducedByField form={form} t={t} />
            </div>

            <div className="flex items-start gap-2">
              <PhoneField form={form} t={t} />
              <EmailField form={form} t={t} />
            </div>

            <div className="flex items-start gap-2">
              <BirthdayField form={form} t={t} />
              <MemberDayField form={form} t={t} />
            </div>

            <div className="flex items-start gap-2">
              <HometownField form={form} t={t} />
              <AddressField form={form} t={t} />
            </div>

            <div className="flex items-start gap-2">
              <GenderField form={form} t={t} />
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

const CuratorField = ({ form, t }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const accounts = useAccountStore((state) => state.accounts);

  return (
    <FormField
      control={form.control}
      name="curatorId"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('curator')}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? accounts.find((account) => account.id === field.value)?.name : t('select_curator')}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="max-h-[300px] p-0">
              <Command>
                <CommandInput placeholder={t('search_curator')} />
                <CommandList>
                  <ScrollArea className={'h-72 overflow-y-auto'}>
                    <CommandEmpty>{t('not_found')}</CommandEmpty>

                    <CommandGroup>
                      {accounts.map((account) => (
                        <CommandItem
                          value={account.id}
                          key={account.id}
                          onSelect={() => {
                            form.setValue('curatorId', account.id);
                            setIsOpen(false);
                          }}
                        >
                          <Check
                            className={cn('mr-2 h-4 w-4', account.id === field.value ? 'opacity-100' : 'opacity-0')}
                          />
                          {account.name}
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

const IntroducedByField = ({ form, t }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const fetchAllMembers = useMemberStore((state) => state.fetchAllMembers);

  React.useEffect(() => {
    fetchAllMembers();
  }, [fetchAllMembers]);

  const members = useMemberStore((state) => state.allMembers);

  return (
    <FormField
      control={form.control}
      name="friendId"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('introduced_by')}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? members.find((member) => member.id === field.value)?.name : t('select_member')}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command>
                <CommandInput placeholder={t('search_member')} />
                <CommandList>
                  <ScrollArea className="h-72">
                    <CommandEmpty>{t('not_found')}</CommandEmpty>

                    <CommandGroup>
                      {members.map((member) => (
                        <CommandItem
                          value={member.id}
                          key={member.id}
                          onSelect={() => {
                            form.setValue('friendId', member.id);
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

const NameField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('name')}</FormLabel>
          <FormControl>
            <Input placeholder={t('name')} className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const PhoneField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('phone')}</FormLabel>
          <FormControl>
            <PhoneInput className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const EmailField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('email')}</FormLabel>
          <FormControl>
            <Input placeholder={t('email')} className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const AddressField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('address')}</FormLabel>
          <FormControl>
            <Input placeholder={t('address')} className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const HometownField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="hometown"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('hometown')}</FormLabel>
          <FormControl>
            <Input placeholder={t('hometown')} className="resize-none" {...field} />
          </FormControl>
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
            <Textarea placeholder={t('note')} className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const GenderField = ({ form, t }: any) => {
  const bgColor: Record<string, string> = {
    [Gender.Male]: 'bg-yellow-400',
    [Gender.Female]: 'bg-purple-400'
  };

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormLabel>{t('gender')}</FormLabel>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder={t('gender')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={Gender.Male}>{t(Gender.Male.toLowerCase())}</SelectItem>
                <SelectItem value={Gender.Female}>{t(Gender.Female.toLowerCase())}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const DiscipleshipProcessField = ({ form, t }: any) => {
  const bgColor: Record<string, string> = {
    [DiscipleshipProcess.Basic]: 'bg-green-400',
    [DiscipleshipProcess.Commitment]: 'bg-yellow-400',
    [DiscipleshipProcess.Equipment]: 'bg-blue-400',
    [DiscipleshipProcess.Empowerment]: 'bg-violet-400'
  };

  return (
    <FormField
      control={form.control}
      name="discipleshipProcess"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel className="my-0 py-0">{t('discipleship_process')}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder={t('discipleship_process')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={DiscipleshipProcess.Basic}>{t(DiscipleshipProcess.Basic.toLowerCase())}</SelectItem>
                <SelectItem value={DiscipleshipProcess.Commitment}>
                  {t(DiscipleshipProcess.Commitment.toLowerCase())}
                </SelectItem>
                <SelectItem value={DiscipleshipProcess.Equipment}>
                  {t(DiscipleshipProcess.Equipment.toLowerCase())}
                </SelectItem>
                <SelectItem value={DiscipleshipProcess.Empowerment}>
                  {t(DiscipleshipProcess.Empowerment.toLowerCase())}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const BirthdayField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="birthday"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('date_of_birth')}</FormLabel>
          <Popover modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(' pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
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

const MemberDayField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="memberDay"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('member_date')}</FormLabel>
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
