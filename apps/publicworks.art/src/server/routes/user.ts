import { z } from "zod";
import { stores } from "../../store/stores";
import { authorizedProcedure, baseProcedure, t } from "../trpc";
import { EditUserRequestZ } from "../../store";
import { TRPCError } from "@trpc/server";
import { serializeUser } from "@publicworks/db-typeorm/serializable";

const getUser = baseProcedure
  .input(z.object({ address: z.string().optional() }))

  .query(async ({ input, ctx }) => {
    if (!input.address) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    const user = await stores().user.getUser(input.address);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return serializeUser(user);
  });
const editUser = authorizedProcedure
  .input(EditUserRequestZ)

  .mutation(async ({ input, ctx }) => {
    const user = ctx.user;
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    try {
      await stores().user.editUser(user.id, input);

      return serializeUser(user);
    } catch (e) {
      if ((e as Error).message?.includes("users_name_uniq")) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "username taken" });
      }
    }
  });

export const userRouter = t.router({
  // Public
  getUser,
  editUser: editUser,
});
