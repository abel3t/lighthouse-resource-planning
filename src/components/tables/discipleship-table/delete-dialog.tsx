'use client';

import useDiscipleshipStore from '@/stores/useDiscipleshipStore';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

import { client } from '@/lib/client';
import { getErrorMessage } from '@/lib/handle-error';

const DeleteDiscipleshipDialog = ({ open, onOpenChange, discipleshipList, onSuccess }: any) => {
  const [, startDeleteTransition] = useTransition();
  const fetchDiscipleshipList = useDiscipleshipStore((state) => state.fetchDiscipleshipList);
  const queryParams = useDiscipleshipStore((state) => state.queryParams);

  const t = useTranslations();
  const discipleshipIds = discipleshipList.map((discipleship: any) => discipleship.getValue('id'));

  const handleDeleteMember = async () => {
    startDeleteTransition(() => {
      toast.promise(client.delete(`/discipleship?ids=${discipleshipIds.join(',')}`), {
        loading: t('delete_record_processing', { name: t('discipleship').toLowerCase() }),
        success: () => {
          onOpenChange(false);
          if (onSuccess) {
            onSuccess();
          }

          fetchDiscipleshipList(queryParams);

          return t('delete_record_successfully', { name: t('discipleship').toLowerCase() });
        },
        error: (error) => {
          onOpenChange(false);

          console.log(getErrorMessage(error));

          return t('create_record_failed', { name: t('discipleship').toLowerCase() });
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[200px] sm:max-w-[425px]">
        {discipleshipList.length > 1 && (
          <p>{t('are_you_sure_to_delete_these_records', { name: t('discipleship').toLowerCase() })}</p>
        )}

        {discipleshipList.length === 1 && (
          <p>{t('are_you_sure_to_delete_this_record', { name: t('discipleship').toLowerCase() })}</p>
        )}

        <DialogFooter>
          <Button variant="destructive" onClick={handleDeleteMember}>
            {t('delete')}
          </Button>

          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDiscipleshipDialog;
