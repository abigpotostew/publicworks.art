import { createRouter } from "../context";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isISODate } from "../../util/isISODate";
import { firestore, ProjectRepo } from "../../store";

export const workRouter = createRouter()
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
            projectName: z.string().min(3).max(50),
            projectBlurb: z.string().min(2).max(515),
            projectSize: z.number().min(1).max(10_000),
            projectDescription: z.string().min(2).max(2048),
            startDate: z.string().refine(isISODate, { message: "Not a valid ISO string date " }),
            royaltyAddress: z.string(),
            royaltyPercent: z.number().min(0).max(100),
          }),
        resolve: async ({ input, ctx }) => {
          // do something in firebase
          const user = ctx?.user
          if (!user) {
            return null
          }
          const project = await new ProjectRepo(firestore()).createProject(user, input)

          return {
            ...project
          };
        }
      })
      .mutation('editWork', {
        input: z
          .object({
            projectName: z.string().min(3).max(50).optional(),
            projectBlurb: z.string().min(2).max(515).optional(),
            projectSize: z.number().min(1).max(10_000).optional(),
            projectDescription: z.string().min(2).max(2048).optional(),
            startDate: z.string().refine(isISODate, { message: "Not a valid ISO string date " }).optional(),
            royaltyAddress: z.string().optional(),
            royaltyPercent: z.number().min(0).max(100).optional(),
          }),
        resolve: async ({ input, ctx }) => {
          // do something in firebase
          const user = ctx?.user
          if (!user) {
            return null
          }
          const project = await new ProjectRepo(firestore()).createProject(user, input)

          return {
            ...project
          };
        }
      })
  )
;