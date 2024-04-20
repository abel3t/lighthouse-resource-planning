'use client';

import {
  CarePriority,
  CareType,
  DiscipleshipProcess,
  DiscipleshipType,
  FriendType,
  Gender,
  PersonalType
} from '@/enums';
import useAccountStore from '@/stores/useAccountStore';
import useCareStore from '@/stores/useCareStore';
import useDiscipleshipStore from '@/stores/useDiscipleshipStore';
import usePersonStore from '@/stores/usePersonStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { CommandList } from 'cmdk';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { AspectRatio } from '@/components/ui/aspect-ratio';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UploadButton, UploadDropzone } from '@/components/uploadthing';

import { deleteImageUploadThing } from '@/lib/api';
import { getErrorMessage } from '@/lib/handle-error';
import { cn } from '@/lib/utils';

const createFundRecordSchema = z.object({
  type: z.nativeEnum(DiscipleshipType),
  personId: z.string().optional(),
  date: z.date(),
  description: z.string().optional(),
  priority: z.nativeEnum(CarePriority)
});
export type CreateRecordSchema = z.infer<typeof createFundRecordSchema>;

export function CreateDiscipleshipDialog() {
  const [open, setOpen] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition();
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CreateRecordSchema>({
    resolver: zodResolver(createFundRecordSchema)
  });

  const queryParams = useCareStore((state) => state.queryParams);
  const fetchPeople = usePersonStore((state) => state.fetchPeople);
  const fetchDiscipleshipList = useDiscipleshipStore((state) => state.fetchDiscipleshipList);

  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const accounts = useAccountStore((state) => state.accounts);

  React.useEffect(() => {
    fetchPeople();
    fetchAccounts();
  }, []);

  function onSubmit(input: CreateRecordSchema) {
    if (!accounts?.length) {
      return;
    }

    startCreateTransition(() => {
      toast.promise(
        axios.post('/api/discipleship', {
          ...input,
          image: fileUrl,
          curatorId: accounts[0]?.id
        }),
        {
          loading: 'Discipleship care...',
          success: () => {
            form.reset();
            setOpen(false);
            setFileUrl(undefined);

            fetchDiscipleshipList(queryParams);

            return 'Discipleship created';
          },
          error: (error) => {
            setOpen(false);
            form.reset();
            if (fileUrl) {
              deleteImageUploadThing(fileUrl);
            }
            setFileUrl(undefined);

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

          if (fileUrl) {
            deleteImageUploadThing(fileUrl);
          }

          setFileUrl(undefined);
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
              <MemberField form={form} />
              <CareTypeField form={form} />
            </div>

            <div className="flex items-start gap-2">
              <CarePriorityField form={form} />

              <DateField form={form} />
            </div>

            <div className="flex items-start gap-2">
              {!fileUrl && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const file: any = res?.[0];

                    setFileUrl(file?.url || '');
                    setIsUploading(false);

                    toast('Upload Completed');
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

const MemberField = ({ form }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const people = usePersonStore((state) => state.people);

  return (
    <FormField
      control={form.control}
      name="personId"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Person</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? people.find((person) => person.id === field.value)?.name : 'Select Member'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command>
                <CommandInput placeholder="Search Contributor..." />
                <ScrollArea className="h-72">
                  <CommandList>
                    <CommandEmpty>No member found.</CommandEmpty>

                    <CommandGroup>
                      {people.map((person) => (
                        <CommandItem
                          value={person.id}
                          key={person.id}
                          onSelect={() => {
                            form.setValue('personId', person.id);
                            setIsOpen(false);
                          }}
                        >
                          <Check
                            className={cn('mr-2 h-4 w-4', person.id === field.value ? 'opacity-100' : 'opacity-0')}
                          />
                          {person.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const CareTypeField = ({ form }: any) => {
  const bgColor: Record<string, string> = {
    [DiscipleshipType.Believe]: 'bg-yellow-400',
    [DiscipleshipType.ShareGospel]: 'bg-yellow-400',
    [DiscipleshipType.Disciple]: 'bg-violet-400'
  };

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel className="my-0  py-0">Discipleship Type</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={DiscipleshipType.Believe}>{DiscipleshipType.Believe}</SelectItem>
                <SelectItem value={DiscipleshipType.ShareGospel}>{DiscipleshipType.ShareGospel}</SelectItem>
                <SelectItem value={DiscipleshipType.Disciple}>{DiscipleshipType.Disciple}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const CarePriorityField = ({ form }: any) => {
  const bgColor: Record<string, string> = {
    [CarePriority.Warning]: 'bg-red-400',
    [CarePriority.Normal]: 'bg-yellow-400',
    [CarePriority.Good]: 'bg-green-400'
  };

  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>Type</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={CarePriority.Warning}>{CarePriority.Warning}</SelectItem>
                <SelectItem value={CarePriority.Normal}>{CarePriority.Normal}</SelectItem>
                <SelectItem value={CarePriority.Good}>{CarePriority.Good}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const DateField = ({ form }: any) => {
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
