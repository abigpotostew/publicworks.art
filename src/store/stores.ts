import { firestore } from "./firestore";
import { ProjectRepo } from "./project";
import { UserRepo } from "./user";

export const stores = () => {
  const fs = firestore();
  return {
    project: new ProjectRepo(fs),
    user: new UserRepo(fs),
  };
};
