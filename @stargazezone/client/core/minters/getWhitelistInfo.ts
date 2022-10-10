import type { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

export async function getWhitelistInfo(
  whitelistAddress: string,
  client: CosmWasmClient
) {
  try {
    const whitelistConfig = await client.queryContractSmart(whitelistAddress, {
      config: {},
    });
    return {
      whitelistContract: whitelistAddress,
      ...whitelistConfig,
    } as any;
  } catch (e) {
    return null;
  }
}
