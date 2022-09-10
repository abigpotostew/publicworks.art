// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyCookie } from "../../src/auth/jwt";


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  if(req.method!=='POST'){
    res.status(404).json({message:'not found'})
    return;
  }
  
  const ok = verifyCookie(req)
  if (!ok) {
    res.status(401).json({ message: 'unauthorized' })
    return;
  }
  
  
  res.status(200).json({ name: 'ok!' })
}
