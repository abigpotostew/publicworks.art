import { stores } from "@publicworks/publicworks.art/src/store/stores";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserRepoDdb } from "@publicworks/publicworks.art/src/store/ddb/user-repo-ddb";
import { UserRepoDdbAdaptor } from "@publicworks/publicworks.art/src/store/ddb/adaptor/user-adaptor";
import {
  RepositoryDbbAdaptor,
  RepositoryDdb,
} from "@publicworks/publicworks.art/src/store";
import chainInfo from "@publicworks/publicworks.art/src/stargaze/chainInfo";
import { WorkEntityDdb } from "@publicworks/publicworks.art/src/store/model";

async function main() {
  // const works = await stores().project.getAccountProjects({
  //   address: "stars1ev6dj8ttxjt2psy5hzevhzl9j9aj5cvcj3pyhr",
  //   limit: 100,
  //   direction: "ASC",
  // });

  const client = new DynamoDBClient();
  const tableName = process.env.DDB_TABLE_NAME;
  if (!tableName) {
    throw new Error("DDB_TABLE_NAME is not set");
  }
  const repo = new RepositoryDdb(tableName, client);

  const works2 = await repo.worksWithInvalidHidden();

  const toHide = [387, 386, 384, 385];
  const works3: WorkEntityDdb[] = [];
  for (let id of toHide) {
    const work = await repo.getProjectForId(chainInfo().chainId, id);
    work && works3.push(work);
  }
  console.log("works with invalid hidden", works2.length);
  console.log("works3 from list", works3.length);

  // stores().project.updateProject();
  const hideWork = async (work: WorkEntityDdb) => {
    await stores().project.updateProject(work.id, {
      hidden: true,
      startDate: work.startDate.toISOString(),
      sg721: work.sg721,
    });
    console.log("work updated", work.id, "hidden", `${work.hidden} -> true`);
  };
  for (const work of works2) {
    await hideWork(work);
  }
  for (const work of works3) {
    await hideWork(work);
  }
}
main();
