'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
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

  const { data: client, isLoading } = (trpc as any).clients.getById.useQuery({ id: clientId });

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

  const updateMutation = (trpc as any).clients.update.useMutation({
    onSuccess: () => {
      setErrors({});
      onSuccess();
      onClose();
    },
    onError: (err: any) => {
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

  if (isLoading) return <div className="fixed inset-0 z-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !updateMutation.isLoading && onClose()}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit Client</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Client name"
              value={formData.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
            <input
              id="company"
              type="text"
              placeholder="Company name"
              value={formData.company || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="client@example.com"
              value={formData.email || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
            <input
              id="phone"
              type="tel"
              placeholder="Phone number"
              value={formData.phone || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={updateMutation.isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isLoading}>
              {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
