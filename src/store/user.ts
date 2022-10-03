import { dataSource } from "../typeorm/datasource";
import { UserEntity } from "../model";
import cuid from "cuid";

export class UserRepo {
  async getUser(address: string): Promise<UserEntity | null> {
    return dataSource().getRepository(UserEntity).findOne({
      where: { address },
    });
  }
  async createIfNeeded(address: string): Promise<UserEntity | null> {
    // return dataSource().getRepository(UserEntity).findOne({
    //   where: { address },
    // });
    const user = new UserEntity();
    user.address = address;
    user.name = "Change me";
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
