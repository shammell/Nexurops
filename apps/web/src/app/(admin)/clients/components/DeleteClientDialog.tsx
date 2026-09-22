'use client'

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'

interface DeleteClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string | null
  onDeleteSuccess?: () => void
}

export function DeleteClientDialog({
  open,
  onOpenChange,
  clientId,
  onDeleteSuccess,
}: DeleteClientDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const deleteMutation = (trpc as any).clients.delete.useMutation({
    onSuccess: () => {
      onOpenChange(false)
      onDeleteSuccess?.()
    },
    onError: (error: any) => {
      setError(error.message)
    },
  })

  const handleConfirmDelete = async () => {
    if (!clientId) return

    setIsDeleting(true)
    setError(null)

    try {
      await deleteMutation.mutateAsync({ id: clientId })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-sm mx-4 shadow-lg">
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Delete Client</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to delete this client? This action cannot be undone.
              </p>

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
