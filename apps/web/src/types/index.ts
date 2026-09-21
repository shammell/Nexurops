export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: 'client' | 'admin'
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold' | 'cancelled'
  progress: number
  budgetUsed: number
  budgetTotal: number
  startDate: Date
  endDate?: Date
  clientId: string
  teamMembers: TeamMember[]
  milestones: Milestone[]
}

export interface TeamMember {
  id: string
  name: string
  avatar?: string
  role: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: Date
  completedAt?: Date
}

export interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  dueDate: Date
  paidAt?: Date
  projectId?: string
  projectName?: string
  stripePaymentId?: string
  pdfUrl?: string
}

export interface LinkedInAnalytics {
  totalImpressions: number
  avgEngagementRate: number
  postsPublished: number
  recentPosts: LinkedInPost[]
}

export interface LinkedInPost {
  id: string
  text: string
  publishedAt: Date
  impressions: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
}

export interface DashboardStats {
  activeProjects: number
  unpaidInvoices: number
  postsPublished: number
  totalRevenue: number
}
