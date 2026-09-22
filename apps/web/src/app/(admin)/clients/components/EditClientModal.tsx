'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc/client';
import { z } from 'zod';

const updateClientSchema = z.object({
  name: z.string().min(1, 'Name required').optional(),
  company: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
});

type UpdateClientInput = z.infer<typeof updateClientSchema>;

interface EditClientModalProps {
  clientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditClientModal({ clientId, onClose, onSuccess }: EditClientModalProps) {
  const [formData, setFormData] = useState<UpdateClientInput>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: client, isLoading } = trpc.clients.getById.useQuery({ id: clientId });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        company: client.company || undefined,
        email: client.email,
        phone: client.phone || undefined,
      });
    }
  }, [client]);

  const updateMutation = trpc.clients.update.useMutation({
    onSuccess: () => {
      setErrors({});
      onSuccess();
      onClose();
    },
    onError: (err) => {
      setErrors({ submit: err.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = updateClientSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    updateMutation.mutate({ id: clientId, ...validation.data });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Client name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Company name"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@example.com"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="Phone number"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
