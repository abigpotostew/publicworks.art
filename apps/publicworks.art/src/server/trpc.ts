import { initTRPC, TRPCError } from "@trpc/server";
import { verifyCookie } from "../auth/jwt";
import { stores } from "../store/stores";
import { Context } from "./context";
import superjson from "superjson";
import { NextApiRequest, NextApiResponse } from "next";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const getContext = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Context> => {
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
    res,
  };
};

const isAuthorized = t.middleware(async ({ next, ctx }) => {
  const { user, authorized } = await getContext(ctx.req, ctx.res);
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
function createAuthorizedMiddleware() {
  return t.middleware(async ({ ctx, next }) => {
    //
    const { user, authorized } = await getContext(ctx.req, ctx.res);
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
    //db initialization
    return next({ ctx });
  })
);

export const authorizedProcedure = baseProcedure.use(isAuthorized);
