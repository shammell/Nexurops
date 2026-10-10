'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientsTable } from './components/ClientsTable'
import { CreateClientModal } from './components/CreateClientModal'

export default function ClientsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients Management</h1>
            <p className="mt-2 text-muted-foreground">Manage and view all your clients</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Client
          </Button>
        </div>

        {/* Clients Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Clients List</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientsTable />
          </CardContent>
        </Card>

        {/* Create Client Modal */}
        <CreateClientModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
        />
      </div>
    </div>
  )
}
