import { ProjectRepo } from "./project";
import { UserRepo } from "./user";
import { IndexerRepo } from "./indexer";

export const stores = () => {
  return {
    project: new ProjectRepo(),
    user: new UserRepo(),
    indexer: new IndexerRepo(),
  };
};
