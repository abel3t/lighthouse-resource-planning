'use client';

import useCareStore from '@/stores/useCareStore';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

import { client } from '@/lib/client';
import { getErrorMessage } from '@/lib/handle-error';

const DeleteCaresDialog = ({ open, onOpenChange, cares }: any) => {
  const [, startDeleteTransition] = useTransition();
  const fetchCares = useCareStore((state) => state.fetchCares);
  const queryParams = useCareStore((state) => state.queryParams);

  const t = useTranslations();
  const caresIds = cares.map((member: any) => member.getValue('id'));

  const handleDeleteMember = async () => {
    startDeleteTransition(() => {
      toast.promise(client.delete(`/cares?ids=${caresIds.join(',')}`), {
        loading: t('delete_record_processing', { name: t('care').toLowerCase().toLowerCase() }),
        success: () => {
          onOpenChange(false);

          fetchCares(queryParams);

          return t('delete_record_successfully', { name: t('care').toLowerCase().toLowerCase() });
        },
        error: (error) => {
          onOpenChange(false);

          console.log(getErrorMessage(error));

          return t('delete_record_failed', { name: t('care').toLowerCase().toLowerCase() });
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[200px] sm:max-w-[425px]">
        {cares.length > 1 && <p>{t('are_you_sure_to_delete_these_records', { name: t('cares').toLowerCase() })}</p>}

        {cares.length === 1 && <p>{t('are_you_sure_to_delete_this_record', { name: t('care').toLowerCase() })}</p>}

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

export default DeleteCaresDialog;
