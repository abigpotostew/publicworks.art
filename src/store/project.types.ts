import { z } from "zod";
import { isISODate } from "../util/isISODate";
import { cidRegex } from "../ipfs/cid";
import { zodStarsAddress, zodStarsContractAddress } from "src/wasm/address";

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
  name: z.string().min(3).max(50),
  blurb: z.string().min(2).max(515).optional(),
  maxTokens: z.number().min(1).max(10_000).optional(),
  description: z.string().min(2).max(2048).optional(),
  startDate: z
    .string()
    .refine(isISODate, { message: "Not a valid ISO string date " })
    .optional(),
  royaltyAddress: zodStarsAddress.optional(),
  royaltyPercent: z.number().min(0).max(100).optional(),

  resolution: z.string().optional(),
  selector: z.string().optional(),
  license: z.string().optional(),
  pixelRatio: z.number().optional(),
  priceStars: z.number().optional(),
});
export type CreateProjectRequest = z.infer<typeof CreateProjectRequestZ>;

export const editProjectZod = z.object({
  id: z.string(),
  name: z.string().min(3).max(50).optional(),
  creator: z.string().optional(),
  blurb: z.string().min(2).max(515).optional(),
  maxTokens: z.number().min(1).max(10_000).optional().default(1),
  description: z.string().min(2).max(2048).optional(),
  additionalDescription: z.string().min(0).max(8000).optional().nullable(),
  externalLink: z.string().max(2048).optional(),
  startDate: z
    .string()
    .refine(isISODate, { message: "Not a valid ISO string date " })
    .optional(),
  royaltyAddress: zodStarsAddress.optional(),
  royaltyPercent: z.number().min(0).max(100).optional(),
  codeCid: z.string().regex(cidRegex).optional(),

  coverImageCid: z.string().regex(cidRegex).optional().nullable(),

  resolution: z
    .string()
    .regex(/^\d+:\d+$/)
    .optional(),
  selector: z.string().min(1).optional(),
  license: z.string().optional().nullable(),
  pixelRatio: z.number().optional(),
  priceStars: z.number().optional(),
  sg721: zodStarsContractAddress.optional().nullable(),
  minter: zodStarsContractAddress.optional().nullable(),
  hidden: z.boolean().optional(),
});
export type EditProjectRequest = z.infer<typeof editProjectZod>;
