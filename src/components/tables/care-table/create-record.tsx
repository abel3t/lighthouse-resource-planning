'use client';

import { CarePriorityText, CareTypeText } from '@/constant';
import { CarePriority, CareType } from '@/enums';
import useAccountStore from '@/stores/useAccountStore';
import useCareStore from '@/stores/useCareStore';
import useMemberStore from '@/stores/useMemberStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { CommandList } from 'cmdk';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import removeAccents from 'remove-accents';
import { toast } from 'sonner';
import * as z from 'zod';

import { Icons } from '@/components/custom/icons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UploadButton } from '@/components/uploadthing';

import { deleteImageUploadThing } from '@/lib/api';
import { client } from '@/lib/client';
import { getErrorMessage } from '@/lib/handle-error';
import { cn } from '@/lib/utils';

const createCareSchema = z.object({
  type: z.nativeEnum(CareType),
  personId: z.string(),
  date: z.date(),
  description: z.string().optional(),
  priority: z.nativeEnum(CarePriority)
});
export type CreateRecordSchema = z.infer<typeof createCareSchema>;

export function CreateCareDialog() {
  const [open, setOpen] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition();
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [isUploading, setIsUploading] = React.useState(false);
  const [isOnCreating, setIsOnCreating] = React.useState(false);

  const t = useTranslations();

  const form = useForm<CreateRecordSchema>({
    resolver: zodResolver(createCareSchema)
  });

  const queryParams = useCareStore((state) => state.queryParams);
  const fetchAllMembers = useMemberStore((state) => state.fetchAllMembers);
  const fetchCares = useCareStore((state) => state.fetchCares);

  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const accounts = useAccountStore((state) => state.accounts);

  React.useEffect(() => {
    fetchAllMembers();
    fetchAccounts();
  }, []);

  function onSubmit(input: CreateRecordSchema) {
    if (!accounts?.length) {
      return;
    }

    setIsOnCreating(true);

    startCreateTransition(() => {
      toast.promise(
        client.post('/cares', {
          ...input,
          image: fileUrl,
          curatorId: accounts[0]?.id
        }),
        {
          loading: t('create_record_processing', { name: t('care').toLowerCase() }),
          success: () => {
            form.reset();
            setOpen(false);
            setIsOnCreating(false);

            setFileUrl(undefined);

            fetchCares(queryParams);

            return t('create_record_successfully', { name: t('care').toLowerCase() });
          },
          error: (error) => {
            setOpen(false);
            setIsOnCreating(false);
            form.reset();
            if (fileUrl) {
              deleteImageUploadThing(fileUrl);
            }
            setFileUrl(undefined);

            console.log(getErrorMessage(error));

            return t('create_record_failed', { name: t('care').toLowerCase() });
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
          {t('new_record')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{t('new_record')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex w-full items-start gap-2">
              <MemberField form={form} t={t} />
              <CareTypeField form={form} t={t} />
            </div>

            <div className="flex items-start gap-2">
              <CarePriorityField form={form} t={t} />

              <DateField form={form} t={t} />
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
                  config={{ appendOnPaste: true }}
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
                  onBeforeUploadBegin={(files) => {
                    return files.map((f) => {
                      return new File([f], '' + f.name, { type: f.type });
                    });
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

const MemberField = ({ form, t }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const members = useMemberStore((state) => state.allMembers);

  return (
    <FormField
      control={form.control}
      name="personId"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col space-y-2">
          <FormLabel>{t('member')}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
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
                <CommandInput placeholder={t('search_member')} />
                <ScrollArea className="h-72">
                  <CommandList>
                    <CommandEmpty>{t('not_found')}.</CommandEmpty>

                    <CommandGroup>
                      {members.map((member) => (
                        <CommandItem
                          value={member.id}
                          key={member.id}
                          onSelect={() => {
                            form.setValue('personId', member.id);
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

const CareTypeField = ({ form, t }: any) => {
  const bgColor: Record<string, string> = {
    [CareType.Message]: 'bg-red-400',
    [CareType.Call]: 'bg-yellow-400',
    [CareType.FaceToFace]: 'bg-cyan-400',
    [CareType.Visit]: 'bg-violet-400'
  };

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel className="my-0 py-0">{t('care_type')}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder={t('care_type')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={CareType.Message}>{t(CareTypeText[CareType.Message])}</SelectItem>
                <SelectItem value={CareType.Call}>{t(CareTypeText[CareType.Call])}</SelectItem>
                <SelectItem value={CareType.FaceToFace}>{t(CareTypeText[CareType.FaceToFace])}</SelectItem>
                <SelectItem value={CareType.Visit}>{t(CareTypeText[CareType.Visit])}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const CarePriorityField = ({ form, t }: any) => {
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
          <FormLabel className="my-0 py-0">{t('care_priority')}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(`${bgColor[field.value]}`, field.value && 'font-bold text-white')}>
                  <SelectValue placeholder={t('care_priority')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={CarePriority.Warning}>{t(CarePriorityText[CarePriority.Warning])}</SelectItem>
                <SelectItem value={CarePriority.Normal}>{t(CarePriorityText[CarePriority.Normal])}</SelectItem>
                <SelectItem value={CarePriority.Good}>{t(CarePriorityText[CarePriority.Good])}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const DateField = ({ form, t }: any) => {
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex w-1/2 flex-col">
          <FormLabel>{t('date')}</FormLabel>
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
