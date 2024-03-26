import { z } from "zod";
import { UserEntity } from "@publicworks/db-typeorm/model/user.entity";

export const usernameRegex = /^[a-zA-Z0-9-_]{3,15}$/;

export const UserFullZ = z.object({
  address: z.string(),
  name: z.string().regex(usernameRegex),
});

export type User = z.infer<typeof UserFullZ>;

export const EditUserRequestZ = z.object({
  name: z
    .string()
    .min(3)
    .max(15)
    .regex(
      usernameRegex,
      "Can only contain numbers, letters, underscores and dashes"
    )
    .optional(),
});

export type EditUserRequest = z.infer<typeof EditUserRequestZ>;

export interface UserRepoI {
  getUser(address: string): Promise<UserEntity | null>;

  createIfNeeded(address: string): Promise<UserEntity | null>;

  // editUser(userId: string, req: Partial<EditUserRequest>): Promise<void>;
}
