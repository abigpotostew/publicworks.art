import { CSSProperties, FC, useEffect, useRef } from "react";
import { normalizeMetadataUri } from "src/wasm/metadata";

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
export const LiveMedia: FC<LiveMediaParams> = (params: LiveMediaParams) => {
  const frame = useRef(null);
  useEffect(() => {
    if (!frame.current) return;
    // frame?.current?.focus();
    setTimeout(() => {
      // const iframe = frame?.current as HTMLIFrameElement;
      // console.log("dev traits art", iframe.contentWindow.attributes);
      // const el=  document.getElementById(id);
      // if(el){
      //   (el as HTMLIFrameElement).contentWindow?.focus()
      //   // (el as HTMLIFrameElement)?.contentWindow?.document.body.focus();
      //
      // }
    }, 250);
  }, [frame]);
  const url =
    typeof params.ipfsUrl === "string"
      ? params.ipfsUrl + "&publicworks=true"
      : normalizeMetadataUri("ipfs://" + params.ipfsUrl.cid) +
        "?hash=" +
        params.ipfsUrl.hash +
        `&publicworks=true`;

  return (
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
    ></iframe>
  );
};
