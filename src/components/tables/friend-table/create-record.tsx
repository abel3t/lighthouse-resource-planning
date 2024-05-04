'use client';

import { FriendType, Gender } from '@/enums';
import useFriendStore from '@/stores/useFriendStore';
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
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { getErrorMessage } from '@/lib/handle-error';
import { cn } from '@/lib/utils';

const createFriendSchema = z.object({
  name: z.string().min(3),
  type: z.nativeEnum(FriendType),
  friendId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  birthday: z.date().optional(),
  hometown: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  description: z.string().optional()
});
export type CreateRecordSchema = z.infer<typeof createFriendSchema>;

export function CreateFriendDialog() {
  const [open, setOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isOnCreating, setIsOnCreating] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition();

  const t = useTranslations();

  const form = useForm<CreateRecordSchema>({
    resolver: zodResolver(createFriendSchema)
  });

  const queryParams = useMemberStore((state) => state.queryParams);
  const fetchAllMembers = useMemberStore((state) => state.fetchAllMembers);
  const fetchFriends = useFriendStore((state) => state.fetchFriends);

  React.useEffect(() => {
    fetchAllMembers();
  }, []);

  function onSubmit(input: CreateRecordSchema) {
    setIsOnCreating(true);

    startCreateTransition(() => {
      toast.promise(axios.post('/api/members', input), {
        loading: t('create_record_processing', { name: t('friend').toLowerCase() }),
        success: () => {
          form.reset();
          setOpen(false);
          setIsOnCreating(false);

          fetchFriends(queryParams);

          return t('create_record_successfully', { name: t('friend').toLowerCase() });
        },
        error: (error) => {
          setOpen(false);
          setIsOnCreating(false);
          console.log(getErrorMessage(error));

          return t('create_record_failed', { name: t('friend').toLowerCase() });
        }
      });
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
              <FriendTypeField form={form} t={t} />
            </div>

            <div className="flex items-start gap-2">
              <IntroducedByField form={form} t={t} />
              <PhoneField form={form} t={t} />
            </div>

            <div className="flex items-start gap-2">
              <EmailField form={form} t={t} />
              <BirthdayField form={form} t={t} />
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

const IntroducedByField = ({ form, t }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
            <Input placeholder={t('phone')} className="resize-none" {...field} />
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
          <FormLabel>{t('phone')}</FormLabel>
          <FormControl>
            <Input placeholder={t('phone')} className="resize-none" {...field} />
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
      name="gender"
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

const FriendTypeField = ({ form, t }: any) => {
  const bgColor: Record<string, string> = {
    [FriendType.Friend]: 'bg-yellow-400',
    [FriendType.Unsure]: 'bg-gray-400',
    [FriendType.Unbeliever]: 'bg-red-400',
    [FriendType.NewLife]: 'bg-green-400'
  };

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel className="my-0 py-0">{t('friend_type')}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder={t('friend_type')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={FriendType.Unbeliever}>{t(FriendType.Unbeliever.toLowerCase())}</SelectItem>
                <SelectItem value={FriendType.Unsure}>{t(FriendType.Unsure.toLowerCase())}</SelectItem>
                <SelectItem value={FriendType.NewLife}>{t(FriendType.NewLife.toLowerCase())}</SelectItem>
                <SelectItem value={FriendType.Friend}>{t(FriendType.Friend.toLowerCase())}</SelectItem>
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
