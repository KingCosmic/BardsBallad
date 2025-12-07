import React, { useCallback } from 'react'
import {Button} from '@/components/ui/button'

import { closeModal } from '@/state/modals'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
  id: number;
  title: string;
  type: string;
  message: string;

  onConfirm(): void;
};

const ConfirmModal: React.FC<Props> = ({ id, title, type, message, onConfirm }) => {
  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Dialog open onOpenChange={() => closeModal(id)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-lg font-medium mb-2">{message}</p>
          <p className="text-sm font-semibold text-destructive">
            This action cannot be undone.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button color={type} variant='destructive'
            onClick={() => {
              onConfirm();
              requestClose();
            }}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default ConfirmModal;