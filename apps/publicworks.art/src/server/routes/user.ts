import { z } from "zod";
import { isISODate } from "../../util/isISODate";
import { stores } from "../../store/stores";
import { authorizedProcedure, baseProcedure, t } from "../trpc";
import {
  CreateProjectRequestZ,
  editProjectZod,
  EditUserRequestZ,
} from "../../store";
import { TRPCError } from "@trpc/server";
import { serializeWork } from "../../dbtypes/works/serialize-work";
import { normalizeMetadataUri } from "../../wasm/metadata";
import {
  deleteCid,
  getMetadataWorkId,
  uploadFileToPinata,
} from "../../ipfs/pinata";
import { dataUrlToBuffer } from "../../base64/dataurl";
import { serializeUser } from "src/dbtypes/users/serialize-user";

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
