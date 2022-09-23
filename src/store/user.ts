import { dataSource } from "../typeorm/datasource";
import { UserEntity } from "../model";

export class UserRepo {
  async getUser(address: string): Promise<UserEntity | null> {
    return dataSource().getRepository(UserEntity).findOne({
      where: { address },
    });
  }
}
