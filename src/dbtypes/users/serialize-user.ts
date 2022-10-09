import { UserEntity, WorkEntity } from "src/model";
import { UserSerializable, userZod } from "src/dbtypes/users/userSerializable";

export const serializeUser = (entity: UserEntity): UserSerializable => {
  return userZod.parse(entity);
};
