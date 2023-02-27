import { initTRPC, TRPCError } from "@trpc/server";
import { verifyCookie } from "../auth/jwt";
import { stores } from "../store/stores";
import { Context } from "./context";
import superjson from "superjson";
import { NextApiRequest } from "next";
import { initializeIfNeeded } from "../typeorm/datasource";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const getContext = async (req: NextApiRequest): Promise<Context> => {
  async function getUser() {
    const cookies = req?.cookies || {};
    if (cookies["PWToken"]) {
      const payload = verifyCookie(req.cookies);
      if (payload) {
        return stores().user.getUser(payload.account);
      }
    }
    return null;
  }

  const maybeUser = await getUser();
  return {
    authorized: !!maybeUser,
    user: maybeUser,
    req,
  };
};
function createAuthorizedMiddleware() {
  return t.middleware(async ({ ctx, next }) => {
    //
    const { user, authorized } = await getContext(ctx.req);
    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    } else {
      return next({
        ctx: {
          ...ctx,
          user,
          authorized,
        },
      });
    }
  });
}

export const baseProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    await initializeIfNeeded();
    return next({ ctx });
  })
);

export const authorizedProcedure = baseProcedure.use(
  createAuthorizedMiddleware()
);
