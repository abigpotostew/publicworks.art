import { UserEntity } from "@publicworks/db-typeorm/model/user.entity";
import { UserRepoI } from "../../mysql";
import chainInfo from "../../../stargaze/chainInfo";
import { UserRepoDdb } from "../user-repo-ddb";
import { UserEntityDdb } from "../../model";

export const mapUser = (res: UserEntityDdb): UserEntity => {
  return {
    id: res.id,
    address: res.address,
    name: "",
    createdDate: res.created,
    updatedDate: res.updated,
    ownedWorks: [],
  };
};

export class UserRepoDdbAdaptor implements UserRepoI {
  constructor(private repo: UserRepoDdb) {}

  async getUser(address: string): Promise<UserEntity | null> {
    const res = await this.repo.getUser(chainInfo().chainId, address);
    if (res) {
      return mapUser(res);
    }
    return null;
  }

  async createIfNeeded(address: string): Promise<UserEntity | null> {
    const out =
      (await this.repo.createIfNeeded(chainInfo().chainId, address)) ?? null;
    if (out) {
      return mapUser(out);
    } else {
      return null;
    }
  }
}
