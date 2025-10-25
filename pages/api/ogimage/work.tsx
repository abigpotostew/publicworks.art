import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import configPw from "../../../src/wasm/config";
export const config = {
  runtime: "edge",
};

const width = 1200;
const height = 600;
export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  let imgQp = searchParams.get("img");

  if (!imgQp) {
    imgQp = `https://${
      configPw.testnet ? "testnet." : ""
    }publicworks.art/img/metatag/metatag-image1.png`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          color: "black",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          // paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="avatar"
          src={imgQp}
          style={{
            width: width,
            height: "100%",
            position: "absolute",
            objectFit: "cover",
          }}
        />
      </div>
    ),
    {
      width,
      height,
    }
  );
}
