import { z } from "zod";
import { isISODate } from "../util/isISODate";

export interface Token {
  hash: string;
  project_id: number;
  token_id: number;
  status: number;
  image_url: string | undefined;
  metadata_uri?: string | undefined;
  updated: number;
}

export enum TokenStatuses {
  QUEUEING = 0,
  ERR_MISSING_PROJECT = 1,
  COMPLETE = 2,
  FINALIZING = 3,
  ERROR_QUEUEING = 4,
}

export const ProjectFullZ = z.object({
  code_cid: z.string().optional().nullable(),
  creator: z.string(),
  max_tokens: z.number().min(1).max(10_000),
  name: z.string(),
  price_stars: z.number(),
  project_id: z.number(),
  sg721: z.string().optional().nullable(),
  minter: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  resolution: z.string().optional().nullable(),
  selector: z.string().optional().nullable(),
  pixel_ratio: z.number().min(1).max(5).optional().nullable(),
  slug: z.string(),
});

export type Project = z.infer<typeof ProjectFullZ>;

export const CreateProjectRequestZ = z.object({
  projectName: z.string().min(3).max(50),
  projectBlurb: z.string().min(2).max(515),
  projectSize: z.number().min(1).max(10_000),
  projectDescription: z.string().min(2).max(2048),
  startDate: z
    .string()
    .refine(isISODate, { message: "Not a valid ISO string date " }),
  royaltyAddress: z.string(),
  royaltyPercent: z.number().min(0).max(100),
});
export type CreateProjectRequest = z.infer<typeof CreateProjectRequestZ>;
