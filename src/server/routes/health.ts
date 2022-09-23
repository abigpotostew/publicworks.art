import { baseProcedure, t } from "../trpc";

export const healthRouter = t.router({
  healthz: baseProcedure.query(() => "yay!"),
});
