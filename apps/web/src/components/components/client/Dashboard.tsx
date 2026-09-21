'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ProjectCard } from './ProjectCard'
import { InvoiceCard } from './InvoiceCard'
import { LinkedInWidget } from './LinkedInWidget'
import type { Project, Invoice, LinkedInAnalytics, DashboardStats } from '@/types'
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface DashboardProps {
  user: {
    name: string
    email: string
  }
  stats: DashboardStats
  projects: Project[]
  invoices: Invoice[]
  linkedinAnalytics: LinkedInAnalytics
  onPayInvoice?: (invoiceId: string) => void
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Projects', icon: FolderKanban, href: '/projects' },
  { label: 'Invoices', icon: FileText, href: '/invoices' },
  { label: 'LinkedIn', icon: BarChart3, href: '/linkedin' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

export function Dashboard({
  user,
  stats,
  projects,
  invoices,
  linkedinAnalytics,
  onPayInvoice
}: DashboardProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r bg-card p-6 space-y-8">
        <div>
          <h2 className="text-xl font-bold">Client Portal</h2>
          <p className="text-sm text-muted-foreground">{user.name}</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, staggerChildren: 0.1 }}
        >
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Projects</span>
                <FolderKanban className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-3xl font-bold">{stats.activeProjects}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                All on track
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unpaid Invoices</span>
                <FileText className="h-4 w-4 text-orange-600" />
              </div>
              <p className="text-3xl font-bold">{stats.unpaidInvoices}</p>
              {stats.unpaidInvoices > 0 ? (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Payment required
                </p>
              ) : (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  All paid
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Posts Published</span>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-3xl font-bold">{stats.postsPublished}</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Spend</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Invoices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invoices.slice(0, 4).map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <InvoiceCard invoice={invoice} onPayNow={onPayInvoice} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <LinkedInWidget analytics={linkedinAnalytics} />
          </div>
        </div>
      </main>
    </div>
  )
}
