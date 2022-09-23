import { z } from "zod";
import { isISODate } from "../../util/isISODate";
import { stores } from "../../store/stores";
import { authorizedProcedure, baseProcedure, t } from "../trpc";
import { CreateProjectRequestZ, editProjectZod } from "../../store";
import { TRPCError } from "@trpc/server";
import { serializeWork } from "../../dbtypes/works/serialize-work";
import { normalizeMetadataUri } from "../../wasm/metadata";

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
      limit: z.number().min(1).max(100),
      offset: z.number().min(0).max(10000),
    })
  )

  .query(async ({ input, ctx }) => {
    const projects = await stores().project.getProjects(input);

    if (!projects) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return projects.map(serializeWork);
  });

const workPreviewImg = baseProcedure
  .input(
    z.object({
      workId: z.string(),
    })
  )

  .query(async ({ input, ctx }) => {
    const preview = await stores().project.getProjectPreviewImage(input.workId);

    if (!preview || !preview.image_url) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return normalizeMetadataUri(preview.image_url);
  });

export const workRouter = t.router({
  // Public
  createWork,
  editWork,
  editWorkContracts,
  getWorkById,
  listWorks,
  workPreviewImg,
});
