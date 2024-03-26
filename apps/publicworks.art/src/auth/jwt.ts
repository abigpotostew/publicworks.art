import * as jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { getToken } from "../util/auth-token";

export interface Token {
  account: string;
}

export const getAccountFromToken = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    const payload = jwt.decode(token);
    if (!payload || typeof payload === "string") {
      return null;
    }
    const account = payload["account"];
    if (typeof account !== "string") {
      return null;
    }
    return account;
  } catch (e) {
    return null;
  }
};

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
    path: "/",
    maxAge: 604_800_000, //7 days
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

export const verifyCookie = (
  cookies: Partial<{
    [p: string]: string;
  }>
): Token | null => {
  const token = cookies[pwTokenName];
  if (!token) return null;
  try {
    return verify(token);
  } catch (e) {
    return null;
  }
};
