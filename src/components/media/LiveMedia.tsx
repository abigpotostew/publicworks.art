import { FC, useEffect, useRef } from "react";

interface LiveMediaParams {
  ipfsUrl:string
  minHeight:number
}
export const LiveMedia: FC<LiveMediaParams> =(params:LiveMediaParams)=>{
  
  const frame = useRef(null)
  useEffect(()=>{
    if(!frame) return;
    // frame?.current?.focus()
    // setTimeout(()=>{
    //  
    //   // const el=  document.getElementById(id);
    //   // if(el){
    //   //   (el as HTMLIFrameElement).contentWindow?.focus()
    //   //   // (el as HTMLIFrameElement)?.contentWindow?.document.body.focus();
    //   //
    //   // }
    // }, 250);
  },[frame])
  return (
    <iframe ref={frame} allow={"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"} allowFullScreen
            height={"100%"} sandbox={"allow-scripts"} src={params.ipfsUrl}
            width={"100%"}
            // onLoad={(e)=>{e.currentTarget.contentWindow?.focus()}}
            style={{ "minHeight": params.minHeight }}
            title={'hello'}></iframe>

  )
}
  
