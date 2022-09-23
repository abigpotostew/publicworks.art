// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyCookie } from "../../src/auth/jwt";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ok = verifyCookie(req.cookies);
  if (!ok) {
    res.status(401).json({ name: "bad token" });
    return;
  }
  res.status(200).json({ name: "ok!" });
}
