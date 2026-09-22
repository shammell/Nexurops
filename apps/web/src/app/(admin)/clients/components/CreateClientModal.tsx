'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { z } from 'zod'

interface CreateClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Validation schema matching tRPC router
const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  company: z.string().optional().nullable(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
})

type CreateClientFormData = z.infer<typeof createClientSchema>

export function CreateClientModal({ open, onOpenChange }: CreateClientModalProps) {
  const [formData, setFormData] = React.useState<CreateClientFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const createMutation = (trpc as any).clients.create.useMutation({
    onSuccess: () => {
      setFormData({ name: '', company: '', email: '', phone: '' })
      setErrors({})
      onOpenChange(false)
    },
    onError: (error: any) => {
      setErrors({ submit: error.message })
    },
  })

  const handleInputChange = (field: keyof CreateClientFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || (field === 'company' || field === 'phone' ? null : ''),
    }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      // Validate form data
      const validatedData = createClientSchema.parse({
        name: formData.name.trim(),
        company: formData.company ? formData.company.trim() : null,
        email: formData.email.trim(),
        phone: formData.phone ? formData.phone.trim() : null,
      })

      setIsSubmitting(true)
      await createMutation.mutateAsync(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path[0] as string
          fieldErrors[path] = err.message
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', company: '', email: '', phone: '' })
    setErrors({})
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Create New Client</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="Client name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-destructive' : 'border-input'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                placeholder="Company name (optional)"
                value={formData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.company ? 'border-destructive' : 'border-input'
                }`}
              />
              {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                placeholder="client@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-destructive' : 'border-input'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+1-555-0000 (optional)"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? 'border-destructive' : 'border-input'
                }`}
              />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Client'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
