import * as trpcNext from "@trpc/server/adapters/next";
import { verifyCookie } from "./jwt";
import { UserRepo } from "../store/user";
import { firestore } from "../store";
import { NextApiRequest, NextApiResponse } from "next";

export async function createContext(req:NextApiRequest, res:NextApiResponse) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  // This is just an example of something you'd might want to do in your ctx fn
  async function getUser() {
    if (req.cookies && req.cookies['PWToken']) {
      // const user = await decodeJwtToken(req.headers.authorization.split(' ')[1])
      // return user;

      const payload = verifyCookie(req)
      if(payload){
        return new UserRepo(firestore()).getUser(payload.account)
      }
    }
    return null;
  }
  const maybeUser = await getUser();
  const user = maybeUser&&maybeUser.ok && maybeUser.value;
  if(!user){
    return {
      authorized:false,
      user:null,
    }
  }else{
    return {
      authorized: true,
      user:user,
    };
  }
}