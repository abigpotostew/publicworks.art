import { UserSerializable, userZod } from "./userSerializable";
import { UserEntity } from "../../model/user.entity";

export const serializeUser = (entity: UserEntity): UserSerializable => {
  return userZod.parse(entity);
};
