/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest } from "next";
import { User } from "../store";
import { UserEntity } from "../model";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  // session: Session | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  return {
    req: opts.req,
    authorized: false,
    user: undefined,
  };
}

export interface Context {
  req: NextApiRequest;
  authorized: boolean | undefined;
  user: UserEntity | undefined | null;
  [key: string]: unknown;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching

  return await createContextInner(opts);
}
