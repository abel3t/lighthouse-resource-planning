'use client';

import useFundRecordStore from '@/stores/useFundRecordStore';
import useFundStore from '@/stores/useFundStore';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

import { client } from '@/lib/client';
import { getErrorMessage } from '@/lib/handle-error';

const DeleteFuncRecordDialog = ({ open, onOpenChange, fundRecords, onSuccess }: any) => {
  const [, startDeleteTransition] = useTransition();

  const fetchFunds = useFundStore((state) => state.fetchFunds);
  const fetchRecords = useFundRecordStore((state) => state.fetchRecords);
  const queryParams = useFundRecordStore((state) => state.queryParams);
  const currentFund = useFundStore((state) => state.currentFund);

  const t = useTranslations();
  const fundRecordIds = fundRecords.map((fundRecord: any) => fundRecord.getValue('id'));

  const handleDeleteMember = async () => {
    startDeleteTransition(() => {
      toast.promise(client.delete(`/fund-records?fundId=${currentFund?.id}&ids=${fundRecordIds.join(',')}`), {
        loading: t('delete_record_processing', { name: t('fund_record').toLowerCase() }),
        success: () => {
          onOpenChange(false);

          if (onSuccess) {
            onSuccess();
          }

          fetchFunds();
          fetchRecords(currentFund?.id || '', queryParams);

          return t('delete_record_successfully', { name: t('fund_record').toLowerCase() });
        },
        error: (error) => {
          onOpenChange(false);

          console.log(getErrorMessage(error));

          return t('delete_record_failed', { name: t('fund_record').toLowerCase() });
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[200px] sm:max-w-[425px]">
        {fundRecords.length > 1 && (
          <p>{t('are_you_sure_to_delete_these_records', { name: t('fund_records').toLowerCase() })}</p>
        )}

        {fundRecords.length === 1 && (
          <p>{t('are_you_sure_to_delete_this_record', { name: t('fund_record').toLowerCase() })}</p>
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

export default DeleteFuncRecordDialog;
