import { InvoiceStatus, PostStatus, ProjectStatus } from "@prisma/client";
import type { DashboardStats, Invoice, LinkedInAnalytics, Project } from "@/types";
import { router, protectedProcedure } from "../server";
import { ownedByClientUser } from "../access";

export type DashboardOverview = {
  stats: DashboardStats;
  projects: Project[];
  invoices: Invoice[];
  linkedinAnalytics: LinkedInAnalytics;
};

const OPEN_STATUSES = [ProjectStatus.BACKLOG, ProjectStatus.IN_PROGRESS, ProjectStatus.REVIEW];

// The schema has no progress column; derive a coarse, honest value from workflow status.
const PROGRESS: Record<ProjectStatus, number> = {
  BACKLOG: 0,
  IN_PROGRESS: 50,
  REVIEW: 85,
  COMPLETED: 100,
  CANCELLED: 0,
};

function uiProjectStatus(s: ProjectStatus): Project["status"] {
  if (s === ProjectStatus.COMPLETED) return "completed";
  if (s === ProjectStatus.CANCELLED) return "cancelled";
  return "active";
}

function uiInvoiceStatus(s: InvoiceStatus): Invoice["status"] {
  if (s === InvoiceStatus.PAID) return "paid";
  if (s === InvoiceStatus.OVERDUE) return "overdue";
  return "pending";
}

export const dashboardRouter = router({
  /** One round-trip for the whole client dashboard, scoped to the caller's own clients. */
  overview: protectedProcedure.query(async ({ ctx }): Promise<DashboardOverview> => {
    const scope = ownedByClientUser(ctx);
    // Clients must never see drafts or voided invoices.
    const visibleInvoice = {
      ...scope,
      status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE, InvoiceStatus.PAID] },
    };
    const published = { ...scope, status: PostStatus.PUBLISHED };

    const [projects, invoices, paidByProject, activeProjects, unpaidInvoices, revenue, postAgg, recentPosts] =
      await Promise.all([
        ctx.db.project.findMany({
          where: scope,
          orderBy: { updatedAt: "desc" },
          take: 20,
        }),
        ctx.db.invoice.findMany({
          where: visibleInvoice,
          orderBy: { dueDate: "desc" },
          take: 20,
          include: { project: { select: { title: true } } },
        }),
        ctx.db.invoice.groupBy({
          by: ["projectId"],
          where: { ...scope, status: InvoiceStatus.PAID, projectId: { not: null } },
          _sum: { totalAmount: true },
        }),
        ctx.db.project.count({ where: { ...scope, status: { in: OPEN_STATUSES } } }),
        ctx.db.invoice.count({
          where: { ...scope, status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] } },
        }),
        ctx.db.invoice.aggregate({
          where: { ...scope, status: InvoiceStatus.PAID },
          _sum: { totalAmount: true },
        }),
        ctx.db.linkedInPost.aggregate({
          where: published,
          _count: { _all: true },
          _sum: { impressions: true },
          _avg: { engagementRate: true },
        }),
        ctx.db.linkedInPost.findMany({
          where: published,
          orderBy: { publishedAt: "desc" },
          take: 5,
        }),
      ]);

    const spent = new Map(
      paidByProject.map((r) => [r.projectId, Number(r._sum.totalAmount ?? 0)] as const),
    );

    return {
      stats: {
        activeProjects,
        unpaidInvoices,
        postsPublished: postAgg._count._all,
        totalRevenue: Number(revenue._sum.totalAmount ?? 0),
      },
      projects: projects.map((p) => ({
        id: p.id,
        name: p.title,
        description: p.description ?? "",
        status: uiProjectStatus(p.status),
        progress: PROGRESS[p.status],
        budgetUsed: spent.get(p.id) ?? 0,
        budgetTotal: Number(p.budget ?? 0),
        startDate: p.startDate ?? p.createdAt,
        endDate: p.deadline ?? undefined,
        clientId: p.clientId,
        teamMembers: [],
        milestones: [],
      })),
      invoices: invoices.map((i) => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        amount: Number(i.totalAmount),
        status: uiInvoiceStatus(i.status),
        dueDate: i.dueDate,
        paidAt: i.paidAt ?? undefined,
        projectId: i.projectId ?? undefined,
        projectName: i.project?.title,
      })),
      linkedinAnalytics: {
        totalImpressions: postAgg._sum.impressions ?? 0,
        avgEngagementRate: postAgg._avg.engagementRate ?? 0,
        postsPublished: postAgg._count._all,
        recentPosts: recentPosts.map((p) => ({
          id: p.id,
          text: p.text,
          publishedAt: p.publishedAt ?? p.createdAt,
          impressions: p.impressions,
          likes: p.likes,
          comments: p.comments,
          shares: p.shares,
          engagementRate: p.engagementRate,
        })),
      },
    };
  }),
});
