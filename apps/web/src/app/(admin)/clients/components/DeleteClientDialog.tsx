'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { trpc } from '@/lib/trpc/client';
import { useEffect, useState } from 'react';

interface DeleteClientDialogProps {
  clientId: string;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteClientDialog({ clientId, onClose, onDelete }: DeleteClientDialogProps) {
  const [clientName, setClientName] = useState('');
  const { data: client } = trpc.clients.getById.useQuery({ id: clientId });

  useEffect(() => {
    if (client) {
      setClientName(client.name);
    }
  }, [client]);

  const deleteMutation = trpc.clients.delete.useMutation({
    onSuccess: () => {
      onDelete();
      onClose();
    },
  });

  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Client</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{clientName}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2 justify-end">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate({ id: clientId })}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
