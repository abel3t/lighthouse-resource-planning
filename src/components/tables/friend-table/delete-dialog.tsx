'use client';

import useFriendStore from '@/stores/useFriendStore';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

import { client } from '@/lib/client';
import { getErrorMessage } from '@/lib/handle-error';

const DeleteFriendsDialog = ({ open, onOpenChange, friends, onSuccess }: any) => {
  const [, startDeleteTransition] = useTransition();
  const fetchFriends = useFriendStore((state) => state.fetchFriends);
  const queryParams = useFriendStore((state) => state.queryParams);

  const t = useTranslations();
  const friendIds = friends.map((friend: any) => friend.getValue('id'));

  const handleDeleteFriend = async () => {
    startDeleteTransition(() => {
      toast.promise(client.delete(`/friends?ids=${friendIds.join(',')}`), {
        loading: t('delete_record_processing', { name: t('dialog_friend').toLowerCase() }),
        success: () => {
          onOpenChange(false);
          if (onSuccess) {
            onSuccess();
          }

          fetchFriends(queryParams);

          return t('delete_record_successfully', { name: t('dialog_friend').toLowerCase() });
        },
        error: (error) => {
          onOpenChange(false);

          console.log(getErrorMessage(error));

          return t('delete_record_failed', { name: t('dialog_friend').toLowerCase() });
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[200px] max-w-[425px] md:max-w-[450px]">
        {friends.length > 1 && (
          <p>{t('are_you_sure_to_delete_these_records', { name: t('dialog_friends').toLowerCase() })}</p>
        )}

        {friends.length === 1 && (
          <p>{t('are_you_sure_to_delete_this_record', { name: t('dialog_friend').toLowerCase() })}</p>
        )}

        <DialogFooter>
          <Button variant="destructive" onClick={handleDeleteFriend}>
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

export default DeleteFriendsDialog;
