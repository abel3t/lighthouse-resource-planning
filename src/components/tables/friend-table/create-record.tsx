'use client';

import { DiscipleshipProcess, FriendType, Gender, PersonalType } from '@/enums';
import useAccountStore from '@/stores/useAccountStore';
import useFriendStore from '@/stores/useFriendStore';
import useMemberStore from '@/stores/useMemberStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { CommandList } from 'cmdk';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { getErrorMessage } from '@/lib/handle-error';
import { cn } from '@/lib/utils';

const createFundRecordSchema = z.object({
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
export type CreateRecordSchema = z.infer<typeof createFundRecordSchema>;

export function CreateFundRecordDialog() {
  const [open, setOpen] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition();

  const form = useForm<CreateRecordSchema>({
    resolver: zodResolver(createFundRecordSchema)
  });

  const queryParams = useMemberStore((state) => state.queryParams);
  const fetchAllMembers = useMemberStore((state) => state.fetchAllMembers);
  const fetchFriends = useFriendStore((state) => state.fetchFriends);

  React.useEffect(() => {
    fetchAllMembers();
  }, []);

  function onSubmit(input: CreateRecordSchema) {
    startCreateTransition(() => {
      toast.promise(axios.post('/api/members', input), {
        loading: 'Creating friend...',
        success: () => {
          form.reset();
          setOpen(false);

          fetchFriends(queryParams);

          return 'friend created';
        },
        error: (error) => {
          setOpen(false);
          return getErrorMessage(error);
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
          New Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Create Record</DialogTitle>
          <DialogDescription>Điền thông tin.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <NameField form={form} />
              <FriendTypeField form={form} />
            </div>

            <div className="flex items-start gap-2">
              <IntroducedByField form={form} />
              <PhoneField form={form} />
            </div>

            <div className="flex items-start gap-2">
              <EmailField form={form} />
              <BirthdayField form={form} />
            </div>

            <div className="flex items-start gap-2">
              <HometownField form={form} />
              <AddressField form={form} />
            </div>

            <div className="flex items-start gap-2">
              <GenderField form={form} />
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

const IntroducedByField = ({ form }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const members = useMemberStore((state) => state.allMembers);

  return (
    <FormField
      control={form.control}
      name="friendId"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Introduced by</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? members.find((member) => member.id === field.value)?.name : 'Select Member'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command>
                <CommandInput placeholder="Search Contributor..." />
                <CommandList>
                  <ScrollArea className="h-72">
                    <CommandEmpty>No member found.</CommandEmpty>

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

const NameField = ({ form }: any) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Tên</FormLabel>
          <FormControl>
            <Input placeholder="Tên" className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const PhoneField = ({ form }: any) => {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Phone</FormLabel>
          <FormControl>
            <Input placeholder="Phone" className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const EmailField = ({ form }: any) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Email" className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const AddressField = ({ form }: any) => {
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Input placeholder="Address" className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const HometownField = ({ form }: any) => {
  return (
    <FormField
      control={form.control}
      name="hometown"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Hometown</FormLabel>
          <FormControl>
            <Input placeholder="hometown" className="resize-none" {...field} />
          </FormControl>
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

const GenderField = ({ form }: any) => {
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
              <FormLabel>Giới tính</FormLabel>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={Gender.Male}>{Gender.Female}</SelectItem>
                <SelectItem value={Gender.Female}>{Gender.Female}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FriendTypeField = ({ form }: any) => {
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
          <FormLabel className="my-0 py-0">Type</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={FriendType.Unbeliever}>{FriendType.Unbeliever}</SelectItem>
                <SelectItem value={FriendType.Unsure}>{FriendType.Unsure}</SelectItem>
                <SelectItem value={FriendType.NewLife}>{FriendType.NewLife}</SelectItem>
                <SelectItem value={FriendType.Friend}>{FriendType.Friend}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const BirthdayField = ({ form }: any) => {
  return (
    <FormField
      control={form.control}
      name="birthday"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Date of birth</FormLabel>
          <Popover modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(' pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Pick a date</span>}
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
