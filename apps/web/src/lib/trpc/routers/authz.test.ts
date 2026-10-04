import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { appRouter } from "./index";

type Call = { model: string; method: string; args: any };

/** Minimal recording stand-in for PrismaClient: every call returns an empty-ish result. */
function makeDb() {
  const calls: Call[] = [];
  const handler = (model: string) =>
    new Proxy(
      {},
      {
        get: (_t, method: string) => async (args: any) => {
          calls.push({ model, method, args });
          if (method === "findMany" || method === "groupBy") return [];
          if (method === "count") return 0;
          if (method === "aggregate") return { _count: { _all: 0 }, _sum: {}, _avg: {} };
          return null; // findFirst / findUnique / update / delete
        },
      },
    );
  const db = new Proxy({}, { get: (_t, model: string) => handler(model) });
  return { db: db as any, calls };
}

const client = { user: { id: "u-client", role: "CLIENT" } };
const admin = { user: { id: "u-admin", role: "ADMIN" } };

function caller(session: any) {
  const { db, calls } = makeDb();
  return { api: appRouter.createCaller({ session, db } as any), calls };
}

const code = (p: Promise<unknown>) =>
  p.then(
    () => "OK",
    (e: any) => e.code as string,
  );

describe("tRPC authorization", () => {
  it("rejects unauthenticated callers", async () => {
    const { api } = caller(null);
    assert.equal(await code(api.projects.list({})), "UNAUTHORIZED");
    assert.equal(await code(api.dashboard.overview()), "UNAUTHORIZED");
  });

  it("scopes project/invoice reads to the caller's own clients", async () => {
    const { api, calls } = caller(client);
    await api.projects.list({});
    await api.invoices.list({});
    const lists = calls.filter((c) => c.method === "findMany");
    assert.equal(lists.length, 2);
    for (const c of lists) assert.deepEqual(c.args.where.client, { userId: "u-client" });
  });

  it("does not let a client override scope via clientId input", async () => {
    const { api, calls } = caller(client);
    await api.projects.list({ clientId: "someone-elses" });
    const where = calls.find((c) => c.method === "findMany")!.args.where;
    assert.deepEqual(where.client, { userId: "u-client" }); // ownership filter is AND-ed in
    assert.equal(where.clientId, "someone-elses"); // so this can only narrow, never widen
  });

  it("returns NOT_FOUND (not FORBIDDEN) for another user's project/invoice", async () => {
    const { api, calls } = caller(client);
    assert.equal(await code(api.projects.getById({ id: "p1" })), "NOT_FOUND");
    assert.equal(await code(api.invoices.getById({ id: "i1" })), "NOT_FOUND");
    for (const c of calls) assert.deepEqual(c.args.where.client, { userId: "u-client" });
  });

  it("lets admins read across clients (no ownership filter)", async () => {
    const { api, calls } = caller(admin);
    await api.projects.list({});
    assert.equal(calls.find((c) => c.method === "findMany")!.args.where.client, undefined);
  });

  it("blocks client-role writes to projects and invoices", async () => {
    const { api, calls } = caller(client);
    const results = await Promise.all([
      code(api.projects.update({ id: "p1", title: "x" })),
      code(api.projects.updateStatus({ id: "p1", status: "COMPLETED" })),
      code(api.projects.delete({ id: "p1" })),
      code(api.invoices.pay({ id: "i1" })),
      code(api.invoices.delete({ id: "i1" })),
      code(api.invoices.create({ clientId: "c1", amount: 1, dueDate: new Date() })),
    ]);
    assert.deepEqual(results, Array(6).fill("FORBIDDEN"));
    assert.equal(calls.length, 0, "no DB access may happen before the role check");
  });

  it("builds a dashboard overview scoped to the caller and hides draft/void invoices", async () => {
    const { api, calls } = caller(client);
    const out = await api.dashboard.overview();
    assert.deepEqual(out.stats, { activeProjects: 0, unpaidInvoices: 0, postsPublished: 0, totalRevenue: 0 });
    for (const c of calls) assert.deepEqual(c.args.where.client, { userId: "u-client" }, `${c.model}.${c.method}`);
    const listed = calls.find((c) => c.model === "invoice" && c.method === "findMany")!;
    assert.deepEqual(listed.args.where.status.in.sort(), ["OVERDUE", "PAID", "SENT"]);
  });
});
