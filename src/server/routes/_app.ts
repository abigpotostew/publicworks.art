/**
 * This file contains the root router of your tRPC-backend
 */

/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from "../trpc";
import { healthRouter } from "./health";
import { workRouter } from "./work";
import { userRouter } from "src/server/routes/user";

export const appRouter = t.router({
  health: healthRouter,
  works: workRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
