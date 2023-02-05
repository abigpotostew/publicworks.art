import {
  TokenSerializable,
  tokenZod,
  WorkSerializable,
  workZod,
} from "./workSerializable";
import { TokenEntity, WorkEntity } from "../../model";

export const serializeWork = (entity: WorkEntity): WorkSerializable => {
  return workZod.parse(entity);
};

export const serializeWorkToken = (entity: TokenEntity): TokenSerializable => {
  return tokenZod.parse(entity);
};
