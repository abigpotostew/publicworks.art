import * as jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export interface Token {
  account: string;
}

export const issue = (account: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("missing secret");
  }
  const tokenPayload: Token = { account: account };
  const token = jwt.sign(tokenPayload, secret, {
    expiresIn: "24h",
  });
  return token;
};

const pwTokenName = "PWToken";
export const issueToCookie = (
  account: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = issue(account);
  const cookies = new Cookies(req, res);
  cookies.set(pwTokenName, token, {
    maxAge: 86_400_000,
    sameSite: "strict",
    httpOnly: false,
  });
};

export const verify = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("missing secret");
  }
  const payload = jwt.verify(token, secret);
  if (typeof payload === "string") {
    throw new Error("incorrect payload");
  }
  const account = payload["account"];
  if (!account) {
    throw new Error("missing account");
  }
  return payload as Token;
};

export const verifyCookie = (req: NextApiRequest): Token | null => {
  const token = req.cookies[pwTokenName];
  try {
    return verify(token);
  } catch (e) {
    return null;
  }
};
