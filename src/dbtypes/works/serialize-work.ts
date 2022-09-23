import { WorkSerializable, workZod } from "./workSerializable";
import { WorkEntity } from "../../model";

export const serializeWork = (entity: WorkEntity): WorkSerializable => {
  return workZod.parse(entity);
};
