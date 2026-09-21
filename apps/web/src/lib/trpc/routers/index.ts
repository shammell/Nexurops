import { router } from "../server";
import { authRouter } from "./auth";
import { clientsRouter } from "./clients";
import { projectsRouter } from "./projects";
import { invoicesRouter } from "./invoices";
import { linkedinRouter } from "./linkedin";

export const appRouter = router({
  auth: authRouter,
  clients: clientsRouter,
  projects: projectsRouter,
  invoices: invoicesRouter,
  linkedin: linkedinRouter,
});

export type AppRouter = typeof appRouter;
