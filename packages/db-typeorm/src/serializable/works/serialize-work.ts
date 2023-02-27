import {
  TokenSerializable,
  tokenZod,
  WorkSerializable,
  workZod,
} from "./workSerializable";
import { TokenEntity, WorkEntity } from "../../model/work.entity";

export const serializeWork = (entity: WorkEntity): WorkSerializable => {
  return workZod.parse({ ...entity, ownerAddress: entity.owner?.address });
};

export const serializeWorkToken = (entity: TokenEntity): TokenSerializable => {
  return tokenZod.parse(entity);
};
