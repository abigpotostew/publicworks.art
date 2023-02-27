import { useQuery } from "@tanstack/react-query";
import config from "../wasm/config";
import { UseQueryOptions } from "@tanstack/react-query/src/types";

export type JsonType = object | number | string | boolean | undefined;

const useFetch = (
  url: string,
  options: Omit<
    UseQueryOptions<unknown, any, JsonType, string[]>,
    "queryKey" | "queryFn" | "initialData"
  > & { initialData?: () => undefined }
) => {
  const query = useQuery(
    [url],
    async () => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(
          `failed to fetch url '${url}', ${res.status}, ${await res.text()}`
        );
      }
      return (await res.json()) as JsonType;
    },
    options
  );
  return query;
};
