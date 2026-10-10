'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { Dashboard } from '@/components/client/Dashboard'
import { trpc } from '@/lib/trpc'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data, isLoading, error, refetch } = trpc.dashboard.overview.useQuery()
  const [notice, setNotice] = React.useState('')

  // Online payment is intentionally not wired yet: settling an invoice must go through
  // Stripe + a verified webhook, never a client-callable mutation.
  const handlePayInvoice = React.useCallback(() => {
    setNotice('Online payment is coming soon. Please contact us to settle this invoice.')
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-3 text-center">
          <p className="font-semibold text-destructive">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground">{error?.message ?? 'Please try again.'}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {notice && (
        <div role="status" className="bg-primary/10 px-4 py-2 text-center text-sm">
          {notice}
        </div>
      )}
      <Dashboard
        user={{
          name: session?.user?.name ?? 'there',
          email: session?.user?.email ?? '',
        }}
        stats={data.stats}
        projects={data.projects}
        invoices={data.invoices}
        linkedinAnalytics={data.linkedinAnalytics}
        onPayInvoice={handlePayInvoice}
      />
    </>
  )
}
