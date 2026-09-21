import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { db } from "../db";

export async function createContext() {
  const session = await getServerSession(authOptions);

  return {
    session,
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
