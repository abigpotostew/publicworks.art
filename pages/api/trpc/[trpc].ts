import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { isISODate } from "../../../src/util/isISODate";
import { Context, createContext } from '../../../src/server/context';
import { firestore, ProjectRepo } from "../../../src/store";
import { workRouter } from "../../../src/server/routes/work";

export const appRouter = createRouter()
  .merge('work.', workRouter) // prefix user procedures with "user."
;
// export type definition of API
export type AppRouter = typeof appRouter;
// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext
});

// Helper function to create a router with your app's context
export function createRouter() {
  return trpc.router<Context>();
}