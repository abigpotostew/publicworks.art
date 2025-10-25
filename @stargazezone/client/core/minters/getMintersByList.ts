import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GetMintersOptions, Minter } from './types';
import getMinter from './getMinter';

export default async function getMintersByList(
  contracts: readonly string[],
  client: CosmWasmClient,
  options: GetMintersOptions
): Promise<Minter[]> {
  return Promise.all(
    contracts.map(
      async (contract) => await getMinter(contract, client, options)
    )
  );
}
