import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import { verify } from "crypto";
import { verifyCookie } from "../../../src/auth/jwt";
import { isISODate } from "../../../src/util/isISODate";
import { Context, createContext } from '../../../src/server/context';
export const appRouter = createRouter()
  .merge(
    'private.',
    createRouter()
      .middleware(async ({ ctx, next }) => {
        if (!(ctx)?.authorized) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next()
      })
      .mutation('createWork', {
        input: z
          .object({
            projectName:z.string().min(3).max(50),
            projectBlurb:z.string().min(2).max(515),
            projectSize:z.number().min(1).max(10_000),
            projectDescription:z.string().min(2).max(2048),
            startDate:z.string().refine(isISODate, { message: "Not a valid ISO string date "}),
            royaltyAddress:z.string(),
            royaltyPercent:z.number().min(0).max(100),
          }),
        resolve({ input }) {
          // do something in firebase

          console.log('heya!', input)
          return {
            greeting: `hello ${input?.projectName ?? 'world'}`,
          };
        },
      }),
  )
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