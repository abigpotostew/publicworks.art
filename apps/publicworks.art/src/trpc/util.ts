import { UseTRPCQueryResult } from "@trpc/react-query/shared";

export const emptyTrpcQueryResult = <T>(): UseTRPCQueryResult<T, any> => {
  return {
    isLoadingError: false,
    isRefetchError: false,
    status: "loading",
    isSuccess: false,
    isError: false,
    data: undefined,
    isLoading: true,
    error: undefined,

    dataUpdatedAt: 0,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    fetchStatus: "idle",
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isPaused: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetching: false,
    isStale: false,

    // @ts-ignore
    refetch: () => {},
    remove: () => {},
    trpc: { path: "" },
  };
};
