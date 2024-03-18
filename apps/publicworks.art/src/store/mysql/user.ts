import cuid from "cuid";
import { EditUserRequest } from "src/store/user.types";
import { UserEntity } from "@publicworks/db-typeorm/model/user.entity";
import { dataSource } from "../../typeorm/datasource";
export interface UserRepoI {
  getUser(address: string): Promise<UserEntity | null>;

  createIfNeeded(address: string): Promise<UserEntity | null>;
  // editUser(userId: string, req: Partial<EditUserRequest>): Promise<void>;
}
export class UserRepo implements UserRepoI {
  async getUser(address: string): Promise<UserEntity | null> {
    return dataSource().getRepository(UserEntity).findOne({
      where: { address },
    });
  }
  async editUser(userId: string, req: Partial<EditUserRequest>) {
    return dataSource().getRepository(UserEntity).update({ id: userId }, req);
  }
  async createIfNeeded(address: string): Promise<UserEntity | null> {
    // return dataSource().getRepository(UserEntity).findOne({
    //   where: { address },
    // });
    const user = new UserEntity();
    user.address = address;
    user.name = address;
    user.id = cuid();

    const query = dataSource()
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([user])
      .orIgnore("users_address_uniq");
    console.log("query", query.getSql());
    const insert = await query.execute();
    return this.getUser(address);
  }
}
