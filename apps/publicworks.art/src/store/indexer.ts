import { dataSource } from "../typeorm/datasource";
import { BlockheightEntity } from "./model";

export class IndexerRepo {
  async getLastSweptHeight(): Promise<BlockheightEntity> {
    const pollHeight = await dataSource()
      .getRepository(BlockheightEntity)
      .findOne({
        where: {
          name: "last_swept_height",
        },
      });
    return (
      pollHeight || {
        height: "0",
        id: "0",
        name: "last_swept_height",
        createdDate: new Date(0),
        updatedDate: new Date(0),
      }
    );
  }
}
