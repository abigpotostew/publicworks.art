import { CSSProperties, FC, useEffect, useRef } from "react";

interface LiveMediaParams {
  ipfsUrl: string;
  minHeight: number;
  style: CSSProperties | undefined;
}
export const LiveMedia: FC<LiveMediaParams> = (params: LiveMediaParams) => {
  const frame = useRef(null);
  useEffect(() => {
    if (!frame.current) return;
    frame?.current?.focus();
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
  return (
    <iframe
      ref={frame}
      allow={
        "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
      }
      allowFullScreen
      height={"100%"}
      sandbox={"allow-scripts allow-downloads"}
      src={params.ipfsUrl}
      width={"100%"}
      // onLoad={(e)=>{e.currentTarget.contentWindow?.focus()}}
      style={{ ...(params.style || {}), minHeight: params.minHeight }}
      title={"hello"}
    ></iframe>
  );
};
