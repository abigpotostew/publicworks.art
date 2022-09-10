import * as jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export const issue=(account:string)=>{
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('missing secret')
  }
  const token = jwt.sign(
    { account: account },
    secret,
    {
      expiresIn: "24h",
    }
  );
  return token;
}

const pwTokenName = 'PWToken';
export const issueToCookie = (account:string, req:NextApiRequest, res:NextApiResponse)=>{
  const token = issue(account);
  const cookies = new Cookies(req, res)
  cookies.set(pwTokenName, token, { maxAge: 86_400_000, sameSite: 'strict', httpOnly:false })
}

export const verify=(token:string)=>{
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('missing secret')
  }
  const verified = jwt.verify(token, secret)
}

export const verifyCookie=(req:NextApiRequest)=>{
  const token = req.cookies[pwTokenName]
  try {
    verify(token)
    return true;
  }catch (e) {
    return false;
  }
}