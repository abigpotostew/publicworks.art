import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const input = {
  ExpressionAttributeNames: {
    "#_0": "gsi2_pk",
    "#_1": "gsi2_sk",
  },
  ExpressionAttributeValues: {
    ":_0": {
      S: "Chain:elgafar-1",
    },
    ":_1": {
      S: "hidden:0#startDate:1970-01-01T00:00:00.000Z",
    },
    ":_2": {
      S: "hidden:0#startDate:",
    },
  },
  KeyConditionExpression: "#_0 = :_0 and begins_with(#_1, :_2) and #_1 > :_1",
  TableName: "ImagoPublicWorks_test2",
  ConsistentRead: false,
  IndexName: "gsi2",
  Limit: 100,
  ScanIndexForward: true,
};
async function main() {
  const client = new DynamoDBClient();
  const command = new QueryCommand(input);
  const response = await client.send(command);
  console.log(response);
}
main();
