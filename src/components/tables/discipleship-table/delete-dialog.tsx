'use client';

import useMemberStore from '@/stores/useMemberStore';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

import { client } from '@/lib/client';
import { getErrorMessage } from '@/lib/handle-error';

const DeleteMembersDialog = ({ open, onOpenChange, members }: any) => {
  const [is, startDeleteTransition] = useTransition();
  const fetchMembers = useMemberStore((state) => state.fetchMembers);
  const queryParams = useMemberStore((state) => state.queryParams);

  const t = useTranslations();
  const memberIds = members.map((member: any) => member.getValue('id'));

  const handleDeleteMember = async () => {
    startDeleteTransition(() => {
      toast.promise(client.delete(`/members?ids=${memberIds.join(',')}`), {
        loading: t('delete_record_processing', { name: t('member').toLowerCase() }),
        success: () => {
          onOpenChange(false);

          fetchMembers(queryParams);

          return t('delete_record_successfully', { name: t('member').toLowerCase() });
        },
        error: (error) => {
          onOpenChange(false);

          console.log(getErrorMessage(error));

          return t('create_record_failed', { name: t('friend').toLowerCase() });
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[200px] sm:max-w-[425px]">
        {members.length > 1 && (
          <p>{t('are_you_sure_to_delete_these_records', { name: t('discipleship').toLowerCase() })}</p>
        )}

        {members.length === 1 && (
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

export default DeleteMembersDialog;
