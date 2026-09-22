'use client'

import * as React from 'react'
import { Edit2, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { trpc } from '@/lib/trpc'
import { DeleteClientDialog } from './DeleteClientDialog'
import type { Client } from '@prisma/client'

export function ClientsTable() {
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  // Mock data - will be replaced with tRPC call
  const mockClients: Client[] = [
    {
      id: '1',
      userId: 'user-1',
      name: 'John Smith',
      company: 'Tech Solutions Inc',
      email: 'john@techsolutions.com',
      phone: '+1-555-0101',
      status: 'ACTIVE',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-09-20'),
      deletedAt: null,
    },
    {
      id: '2',
      userId: 'user-1',
      name: 'Sarah Johnson',
      company: 'Innovation Labs',
      email: 'sarah@innovationlabs.com',
      phone: '+1-555-0102',
      status: 'ACTIVE',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-09-19'),
      deletedAt: null,
    },
    {
      id: '3',
      userId: 'user-1',
      name: 'Michael Brown',
      company: null,
      email: 'michael@example.com',
      phone: null,
      status: 'INACTIVE',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-09-10'),
      deletedAt: null,
    },
    {
      id: '4',
      userId: 'user-1',
      name: 'Emily Davis',
      company: 'Digital Ventures',
      email: 'emily@digitalventures.com',
      phone: '+1-555-0104',
      status: 'CHURNED',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-08-15'),
      deletedAt: null,
    },
  ]

  const { data, isLoading, error: queryError, refetch } = (trpc as any).clients.list.useQuery({
    page: 1,
    limit: 10,
  })

  const clients = data?.clients || mockClients
  const isError = !!queryError

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800'
      case 'CHURNED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeleteClick = (clientId: string) => {
    setSelectedClientId(clientId)
    setIsDeleteDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">Failed to load clients</p>
          <p className="text-xs text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-muted-foreground">No clients found</p>
          <p className="text-xs text-muted-foreground">Create your first client to get started</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client: Client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.company || '-'}</TableCell>
              <TableCell className="text-sm">{client.email}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(client.status)} border-0`}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    title="Edit client"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(client.id)}
                    title="Delete client"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <DeleteClientDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        clientId={selectedClientId}
        onDeleteSuccess={() => refetch()}
      />
    </>
  )
}
