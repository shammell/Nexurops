'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice } from '@/types'
import { Download, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

interface InvoiceCardProps {
  invoice: Invoice
  onPayNow?: (invoiceId: string) => void
}

const statusColors = {
  paid: 'success',
  pending: 'warning',
  overdue: 'destructive',
} as const

export function InvoiceCard({ invoice, onPayNow }: InvoiceCardProps) {
  const handlePayNow = () => {
    onPayNow?.(invoice.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
              <p className="text-sm text-muted-foreground">
                {invoice.projectName || 'General Invoice'}
              </p>
            </div>
            <Badge variant={statusColors[invoice.status]}>
              {invoice.status.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-lg">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Due Date</span>
              <span>{formatDate(invoice.dueDate)}</span>
            </div>
            {invoice.paidAt && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid On</span>
                <span className="text-green-600">{formatDate(invoice.paidAt)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {invoice.status !== 'paid' && (
              <Button onClick={handlePayNow} className="flex-1">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Button>
            )}
            <Button variant="outline" className={invoice.status === 'paid' ? 'flex-1' : ''}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
