import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export default async function getNumTokensLeft(
  minterContract: string,
  client: CosmWasmClient
): Promise<number> {
  const numTokensLeft: {
    count: any;
  } = await client.queryContractSmart(minterContract, {
    mintable_num_tokens: {},
  });

  return Number(numTokensLeft.count);
}
