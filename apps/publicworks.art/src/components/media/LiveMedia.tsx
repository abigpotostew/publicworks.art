import {
  CSSProperties,
  FC,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { normalizeMetadataUri } from "src/wasm/metadata";
import useAppIsLoading from "src/components/loading/useAppIsLoading";
import SpinnerLoading from "src/components/loading/Loader";

interface LiveMediaParams {
  ipfsUrl:
    | string
    | {
        cid: string;
        hash: string;
      };
  minHeight: number;
  style?: CSSProperties | undefined;
}
const isSameUrl = (url1: string, url2: string): boolean => {
  return trimTrailingSlash(url1) === trimTrailingSlash(url2);
};
const trimTrailingSlash = (url: string): string => {
  return url.replace(/\/$/, "");
};
export const LiveMedia: FC<LiveMediaParams> = (params: LiveMediaParams) => {
  const appLoading = useAppIsLoading();
  const frame = appLoading.iframeRef;
  const setAppIsLoading = appLoading.setAppIsLoading;
  // const [appIsLoading, setAppIsLoading] = useState(true);
  const url =
    typeof params.ipfsUrl === "string"
      ? params.ipfsUrl + "&publicworks=true"
      : normalizeMetadataUri("ipfs://" + params.ipfsUrl.cid) +
        "?hash=" +
        params.ipfsUrl.hash +
        `&publicworks=true`;
  useEffect(() => {
    setAppIsLoading(true);
  }, [url]);

  const onIframeLoad = useCallback(() => {
    const iframe = frame.current;
    if (!iframe || !isSameUrl(iframe.src, url)) {
      return;
    }

    setAppIsLoading(false);
  }, [url, frame, setAppIsLoading]);

  return (
    <>
      {(appLoading.appIsLoading || appLoading.appIsLoading) && (
        <div>
          <SpinnerLoading />
          {appLoading.isLoadingSlow && <span>Still loading...</span>}
        </div>
      )}

      <iframe
        ref={frame}
        allow={
          "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
        }
        allowFullScreen
        height={"100%"}
        sandbox={"allow-scripts allow-downloads"}
        src={url}
        width={"100%"}
        // onLoad={(e)=>{e.currentTarget.contentWindow?.focus()}}
        style={{ ...(params.style || {}), minHeight: params.minHeight }}
        title={"hello"}
        onLoad={() => {
          onIframeLoad();
        }}
      ></iframe>
    </>
  );
};
