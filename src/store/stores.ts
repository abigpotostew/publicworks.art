import { ProjectRepo } from "./project";
import { UserRepo } from "./user";

export const stores = () => {
  return {
    project: new ProjectRepo(),
    user: new UserRepo(),
  };
};
