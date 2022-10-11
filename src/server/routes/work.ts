import { z } from "zod";
import { isISODate } from "../../util/isISODate";
import { stores } from "../../store/stores";
import { authorizedProcedure, baseProcedure, t } from "../trpc";
import { CreateProjectRequestZ, editProjectZod } from "../../store";
import { TRPCError } from "@trpc/server";
import { serializeWork } from "../../dbtypes/works/serialize-work";
import { normalizeMetadataUri } from "../../wasm/metadata";
import {
  deleteCid,
  getMetadataWorkId,
  uploadFileToPinata,
} from "../../ipfs/pinata";
import { dataUrlToBuffer } from "../../base64/dataurl";
import { zodStarsAddress } from "src/wasm/address";

const createWork = authorizedProcedure
  .input(CreateProjectRequestZ)
  .mutation(async ({ input, ctx }) => {
    // do something in firebase
    const user = ctx?.user;
    if (!user) {
      return null;
    }
    const project = await stores().project.createProject(user, input);
    if (!project.ok) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
    return serializeWork(project.value);
  });
const editWork = authorizedProcedure
  .input(editProjectZod)

  .mutation(async ({ input, ctx }) => {
    const user = ctx?.user;
    if (!user) {
      return null;
    }
    const work = await stores().project.getProject(input.id);
    if (!work || work.owner.id !== user.id) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const project = await stores().project.updateProject(user, input);
    if (!project.ok) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
    return serializeWork(project.value);
  });
const editWorkContracts = authorizedProcedure
  .input(
    z.object({
      id: z.string(),
      sg721: z.string(),
      minter: z.string(),
    })
  )

  .mutation(async ({ input, ctx }) => {
    const user = ctx?.user;
    if (!user) {
      return null;
    }
    const work = await stores().project.getProject(input.id);
    if (!work || work.owner.id !== user.id) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const project = await stores().project.updateProject(user, input);
    if (!project.ok) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
    return serializeWork(project.value);
  });
const getWorkById = baseProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )

  .query(async ({ input, ctx }) => {
    const project = await stores().project.getProject(input.id);

    if (!project) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return serializeWork(project);
  });
const listWorks = baseProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.number().min(0).max(10000).nullish(),
      publishedState: z
        .string()
        .optional()
        .default("PUBLISHED")
        .refine((val) => {
          return ["PUBLISHED", "UNPUBLISHED", "ALL"].includes(val);
        }),
      address: zodStarsAddress.optional(),
    })
  )

  .query(async ({ input, ctx }) => {
    const { items, nextOffset: nextCursor } =
      await stores().project.getProjects({
        ...input,
        offset: input.cursor || undefined,
      });

    return { items: items.map(serializeWork), nextCursor };
  });

const listAddressWorks = baseProcedure
  .input(
    z.object({
      address: zodStarsAddress,
      limit: z.number().min(1).max(100).default(10),
      cursor: z.number().min(0).max(10000).nullish(),
      publishedState: z
        .string()
        .optional()
        .default("PUBLISHED")
        .refine((val) => {
          return ["PUBLISHED", "UNPUBLISHED", "ALL"].includes(val);
        }),
    })
  )

  .query(async ({ input, ctx }) => {
    const { items, nextOffset: nextCursor } =
      await stores().project.getAccountProjects({
        ...input,
        offset: input.cursor || undefined,
      });

    return { items: items.map(serializeWork), nextCursor };
  });

const workPreviewImg = baseProcedure
  .input(
    z.object({
      workId: z.string(),
    })
  )

  .query(async ({ input, ctx }) => {
    const project = await stores().project.getProject(input.workId);
    if (project?.coverImageCid) {
      return normalizeMetadataUri("ipfs://" + project.coverImageCid);
    }
    const preview = await stores().project.getProjectPreviewImage(input.workId);

    if (!preview || !preview.image_url) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return normalizeMetadataUri(preview.image_url);
  });

const uploadPreviewImg = authorizedProcedure
  .input(
    z.object({
      workId: z.string(),
      coverImageDataUrl: z.string(),
    })
  )

  .mutation(async ({ input, ctx }) => {
    const work = await stores().project.getProject(input.workId);
    if (!work || work.owner.id !== ctx.user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const { buffer, contentType } = dataUrlToBuffer(input.coverImageDataUrl);
    console.log("contentType", contentType);
    if (work.coverImageCid) {
      const existinWorkId = await getMetadataWorkId(work.coverImageCid);
      if (existinWorkId === work.id) {
        //only delete it if the current user owns it.
        await deleteCid(work.coverImageCid);
      }
    }
    const coverImageCid = await uploadFileToPinata(buffer, contentType, {
      workId: work.id,
    });
    const response = await stores().project.updateProject(ctx.user, {
      id: work.id,
      coverImageCid,
    });
    if (!response.ok) {
      throw response.error;
    }

    return { ok: true };
  });

export const workRouter = t.router({
  // Public
  createWork,
  editWork,
  editWorkContracts,
  getWorkById,
  listWorks: listWorks,
  workPreviewImg,
  uploadPreviewImg,
  listAddressWorks,
});
