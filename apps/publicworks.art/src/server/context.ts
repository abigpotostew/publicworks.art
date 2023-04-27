/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../store";
import { UserEntity } from "../store/model";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  // session: Session | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(
  opts: CreateNextContextOptions
): Promise<Context> {
  return {
    req: opts.req,
    res: opts.res,
    authorized: false,
    user: undefined,
  };
}

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
  authorized: boolean | undefined;
  user: UserEntity | undefined | null;
  // [key: string]: unknown;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: CreateNextContextOptions
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching
  const contextInner = await createContextInner(opts);

  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
  // return await createContextInner(opts);
}
