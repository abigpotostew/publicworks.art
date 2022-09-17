import { FirestoreStore } from "./firestore";
import { Err, Ok, Result } from "../util/result";
import { CreateProjectRequest } from "../components/creatework/CreateWork";
import { User } from "./user.types";
import { Project, ProjectFullZ } from "./project.types";
import { Firestore } from "@google-cloud/firestore";

export class ProjectRepo {
  private readonly store: FirestoreStore;
  private readonly db: Firestore;
  constructor(store: FirestoreStore) {
    this.store = store;
    this.db = this.store.db;
  }

  async getProject(id: string): Promise<Project | null> {
    const projectRef = this.db.collection("projects").doc(`project-${id}`);
    const project = await projectRef.get();
    if (project.exists) {
      return ProjectFullZ.parse(project.data());
    } else {
      return null;
    }
  }
  async createProject(
    user: User,
    request: CreateProjectRequest
  ): Promise<Result<Project>> {
    const id = await this.nextProjectId();
    const projectRef = this.db.collection("projects").doc(`project-${id}`);
    const project: Project = {
      code_cid: null,
      creator: user.address,
      max_tokens: request.projectSize,
      name: request.projectName,
      price_stars: 1,
      project_id: id,
      sg721: null,
      minter: null,
      description: request.projectDescription,
      slug: convertToSlug(request.projectName),
      pixel_ratio: null,
      selector: null,
      resolution: null,
    };
    await projectRef.set(project);
    return Ok(project);
  }

  async updateProject(
    user: User,
    request: Partial<Project>
  ): Promise<Result<Project>> {
    if (!request.project_id) {
      return Err(new Error("missing project_id"));
    }

    const id = request.project_id;
    const projectRef = this.db.collection("projects").doc(`project-${id}`);

    const project: Partial<Project> = {
      ...request,
    };
    //cannot edit these fields
    project.slug = undefined;
    project.project_id = undefined;
    await projectRef.set(project);
    return Ok(ProjectFullZ.parse((await projectRef.get()).data()));
  }

  async nextProjectId(): Promise<number> {
    const docRef = this.db.collection("serial").doc("projects");

    try {
      const newId = await this.db.runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (incDoc) {
          //if no value exist, assume it as 0 and increase to 1
          const newIncId: number = (incDoc?.data()?.autoincrement || 0) + 1;

          transaction.update(docRef, { autoincrement: newIncId });
          return newIncId;
        });
      });
      console.log("New autoincremented number ", newId);
      return newId;
    } catch (e) {
      console.error("failed to increment project id", e);
      throw e;
    }
  }
}

export function convertToSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  const to = "aaaaaeeeeeiiiiooooouuuunc------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}
