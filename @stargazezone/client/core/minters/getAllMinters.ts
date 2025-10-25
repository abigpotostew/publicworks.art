import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import getMintersByList from "./getMintersByList";
import { GetMintersOptions, Minter } from "./types";

export default async function getAllMinters(
  codeId: number,
  client: CosmWasmClient,
  options: GetMintersOptions
): Promise<Minter[]> {
  // default options
  const exclude = options.exclude ?? [];
  // fetch contracts
  let contracts = await client.getContracts(codeId);
  // filter
  contracts = contracts.filter((contract) => !exclude.includes(contract));

  return getMintersByList(contracts, client, options);
}
