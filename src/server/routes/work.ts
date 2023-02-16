import { z } from "zod";
import { isISODate } from "../../util/isISODate";
import { stores } from "../../store/stores";
import { authorizedProcedure, baseProcedure, t } from "../trpc";
import { CreateProjectRequestZ, editProjectZod } from "../../store";
import { TRPCError } from "@trpc/server";
import {
  serializeWork,
  serializeWorkToken,
} from "../../dbtypes/works/serialize-work";
import { normalizeMetadataUri } from "../../wasm/metadata";
import {
  deleteCid,
  getMetadataWorkId,
  uploadFileToPinata,
} from "../../ipfs/pinata";
import { dataUrlToBuffer } from "../../base64/dataurl";
import { zodStarsAddress, zodStarsContractAddress } from "src/wasm/address";
import cuid from "cuid";
import { createPresignedUrl } from "src/upload/presignedUrl";
import {
  confirmCoverImageUpload,
  confirmUpload,
} from "src/upload/confirm-upload";
import mime from "mime-types";

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

    const project = await stores().project.updateProject(input.id, input);
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

    const project = await stores().project.updateProject(input.id, input);
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
const getWorkBySlug = baseProcedure
  .input(
    z.object({
      slug: z.string(),
    })
  )

  .query(async ({ input, ctx }) => {
    const project = await stores().project.getProjectBySlug(input.slug);

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
      order: z
        .string()
        .default("asc")
        .refine((val) => {
          return ["desc", "asc"].includes(val);
        }, "sort must be asc or desc"),
      includeHidden: z.boolean(),
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
      direction: z.string().default("DESC"),
    })
  )

  .query(async ({ input, ctx }) => {
    let direction: "DESC" | "ASC" = "DESC";
    if (input.direction === "ASC") {
      direction = "ASC";
    }
    const { items, nextOffset: nextCursor } =
      await stores().project.getAccountProjects({
        ...input,
        direction,
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

    if (!preview || !preview.imageUrl) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return normalizeMetadataUri(preview.imageUrl);
  });
const workTokenCount = baseProcedure
  .input(
    z.object({
      slug: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    return stores().project.getTokenCount(input.slug);
  });

const lastMintedToken = baseProcedure
  .input(
    z.object({
      slug: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const token = await stores().project.lastMintedToken(input.slug);
    if (!token) {
      return null;
    }
    return serializeWorkToken(token);
  });

const uploadPreviewImg = authorizedProcedure
  .input(
    z.object({
      workId: z.string(),
      coverImageDataUrl: z.string(),
    })
  )

  .mutation(async ({ input, ctx }) => {
    console.log("hello here start");
    const work = await stores().project.getProject(input.workId);
    console.log("got work");
    if (!work || work.owner.id !== ctx.user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const { buffer, contentType } = dataUrlToBuffer(input.coverImageDataUrl);
    console.log("contentType", contentType);
    if (work.coverImageCid) {
      console.log("deleting old image cid");
      const existinWorkId = await getMetadataWorkId(work.coverImageCid);
      if (existinWorkId === work.id) {
        //only delete it if the current user owns it.
        await deleteCid(work.coverImageCid);
        console.log("deleted old image cid");
      }
    }
    console.log("uploading");
    const coverImageCid = await uploadFileToPinata(buffer, contentType, {
      workId: work.id,
    });
    console.log("finished uploading");
    const response = await stores().project.updateProject(work.id, {
      coverImageCid,
    });
    if (!response.ok) {
      throw response.error;
    }

    return { ok: true };
  });

const uploadWorkGenerateUrl = authorizedProcedure
  .input(
    z.object({
      workId: z.string(),
      contentType: z.string().optional().nullish(),
      contentSize: z.number().min(1).max(20_000_000),
    })
  )

  .mutation(async ({ input, ctx }) => {
    const work = await stores().project.getProject(input.workId);
    if (!work || work.owner.id !== ctx.user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const { url, filename } = await createPresignedUrl(
      work,
      "application/zip",
      "code",
      input.contentSize
    );
    const obj = await stores().project.saveUploadId(work, filename);

    return { ok: true, url, method: "PUT", uploadId: obj.id };
  });

const confirmWorkUpload = authorizedProcedure
  .input(
    z.object({
      workId: z.string(),
      uploadId: z.string().cuid(),
    })
  )

  .mutation(async ({ input, ctx }) => {
    const work = await stores().project.getProject(input.workId);
    if (!work || work.owner.id !== ctx.user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    //it throws
    const confirmed = await confirmUpload(input.uploadId, work);

    return;
  });
const uploadWorkCoverImageGenerateUrl = authorizedProcedure
  .input(
    z.object({
      workId: z.string(),
      contentType: z.string(),
      contentSize: z.number().min(1).max(20_000_000),
    })
  )

  .mutation(async ({ input, ctx }) => {
    const work = await stores().project.getProject(input.workId);
    if (!work || work.owner.id !== ctx.user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const lookup = mime.contentType(input.contentType);
    if (!lookup) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid content type",
      });
    }

    const { url, filename } = await createPresignedUrl(
      work,
      input.contentType || undefined,
      "cover-image",
      input.contentSize
    );
    const obj = await stores().project.saveUploadId(work, filename);

    return { ok: true, url, method: "PUT", uploadId: obj.id };
  });
const confirmWorkCoverImageUpload = authorizedProcedure
  .input(
    z.object({
      workId: z.string(),
      uploadId: z.string().cuid(),
    })
  )

  .mutation(async ({ input, ctx }) => {
    const work = await stores().project.getProject(input.workId);
    if (!work || work.owner.id !== ctx.user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    //it throws
    const confirmed = await confirmCoverImageUpload(input.uploadId, work);

    return;
  });

export const workRouter = t.router({
  // Public
  createWork: createWork,
  editWork,
  editWorkContracts,
  getWorkById: getWorkById,
  getWorkBySlug,
  listWorks: listWorks,
  workPreviewImg,
  uploadPreviewImg: uploadPreviewImg,
  listAddressWorks,
  workTokenCount: workTokenCount,
  lastMintedToken: lastMintedToken,
  uploadWorkGenerateUrl: uploadWorkGenerateUrl,
  uploadWorkCoverImageGenerateUrl: uploadWorkCoverImageGenerateUrl,
  confirmWorkUpload: confirmWorkUpload,
  confirmWorkCoverImageUpload: confirmWorkCoverImageUpload,
});
