export interface IndexerStoreI {
  getLastSweptHeight(): Promise<{ height: bigint; updatedAt: Date }>;

  setLastSweptHeight(height: bigint): Promise<void>;

  /**@deprecated*/
  setCurrentPollHeightHeight(height: bigint): Promise<void>;
}
