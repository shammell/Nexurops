'use client'

import * as React from 'react'
import { Dashboard } from '@/components/client/Dashboard'
import { trpc } from '@/lib/trpc'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.getStats.useQuery()
  const { data: projects, isLoading: projectsLoading } = trpc.project.getAll.useQuery()
  const { data: invoices, isLoading: invoicesLoading } = trpc.invoice.getAll.useQuery()
  const { data: linkedinAnalytics, isLoading: analyticsLoading } = trpc.linkedin.getAnalytics.useQuery()

  const createCheckoutSession = trpc.invoice.createCheckoutSession.useMutation()

  const handlePayInvoice = async (invoiceId: string) => {
    try {
      const { checkoutUrl } = await createCheckoutSession.mutateAsync({ invoiceId })
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Failed to create checkout session:', error)
    }
  }

  if (statsLoading || projectsLoading || invoicesLoading || analyticsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats || !projects || !invoices || !linkedinAnalytics) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-destructive font-semibold">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <Dashboard
      user={{
        name: 'John Doe',
        email: 'john@example.com',
      }}
      stats={stats}
      projects={projects}
      invoices={invoices}
      linkedinAnalytics={linkedinAnalytics}
      onPayInvoice={handlePayInvoice}
    />
  )
}
