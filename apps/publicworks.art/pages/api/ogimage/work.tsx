import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const width = 1200;
const height = 630;
export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const workIdQp = searchParams.get("workId");
  // if (!workIdQp) {
  return new ImageResponse(<>{`Visit with "?workId=${workIdQp}"`}</>, {
    width,
    height,
  });
  // }
  // const workId = parseInt(workIdQp);
  // if (!workId) {
  //   return new ImageResponse(<>{`Visit with "?workId=${workIdQp}"`}</>, {
  //     width,
  //     height,
  //   });
  // }
  // const work = await stores().project.getProject(workId);
  // const workToken = await stores().project.getTokens({
  //   limit: 1,
  //   offset: 0,
  //   publishedState: null,
  //   includeHidden: false,
  // });
  // let workImage = "https://publicworks.art/img/metatag/metatag-image1.png";
  // if (workToken.items?.length === 1 && workToken.items[0].imageUrl) {
  //   workImage = normalizeIpfsUri(workToken.items[0].imageUrl);
  // }
  //
  // return new ImageResponse(
  //   (
  //     <div
  //       style={{
  //         fontSize: 60,
  //         color: "black",
  //         background: "#f6f6f6",
  //         width: "100%",
  //         height: "100%",
  //         paddingTop: 50,
  //         flexDirection: "column",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         display: "flex",
  //       }}
  //     >
  //       {/* eslint-disable-next-line @next/next/no-img-element */}
  //       <img
  //         alt="avatar"
  //         width="256"
  //         src={workImage}
  //         style={{
  //           borderRadius: 12,
  //         }}
  //       />
  //       <p>github.com/{"username"}</p>
  //     </div>
  //   ),
  //   {
  //     width,
  //     height,
  //   }
  // );
}
