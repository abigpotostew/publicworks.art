// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createContext } from "../../src/auth/apiauth";
import multiparty from "multiparty";
import * as fs from "fs";
import { ProjectRepo, firestore } from "../../../src/store";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  if (req.method !== 'POST') {
    res.status(404).json({ message: 'not found' })
    return;
  }

  const ctx = await createContext(req, res)
  if (!ctx.authorized || !ctx.user) {
    res.status(401).json({ message: 'unauthorized' })
    return;
  }
  
  const {workId} = req.query;
  if(typeof workId !== 'string' || !Number.isFinite(parseInt(workId))){
    res.status(400).json({ message: 'bad id' })
    return;
  }
  
  const work =await new ProjectRepo(firestore()).getProject(workId)
  if(!work || work.creator !== ctx?.user?.address){
    res.status(404).json({ message: 'not found' })
    return; 
  }

  const form = new multiparty.Form({ maxFilesSize: 1000000, autoFiles: true });
  let data: any;
  try {
    data = await new Promise<any>((resolve, reject) => {
      form.parse(req, function (err, fields, files) {
        if (err) reject({ err });
        resolve({ fields, files });
      });
    });
    console.log(`data: `, JSON.stringify(data));
    if(Object.keys(data.files).length!==1 ){
      res.status(400).json({ name: "too many 'file'" })
      return;
    }
    const file = data.files['file']
    if (!file) {
      res.status(400).json({ name: "missing 'file'" })
      return;
    }
    if(file.length !== 1){
      res.status(400).json({ name: "multiple 'file' entries" })
      return;
    }
    const fileObj = file[0];

    if (fileObj.headers['content-type'] !== 'application/zip') {
      res.status(400).json({ name: "not application/zip" })
      return;
    }
    const tmpPath = fileObj.path;
    
    //upload to pinata and set the url.

    res.status(200).json({ name: 'ok!' })
  } finally {
    if (data?.files) {
      for (let fileName of Object.keys(data.files)) {
        const fileArr = data.files[fileName]
        for (let file of fileArr) {
          try {

            fs.rmSync(file.path, {
              force: true,
            })
            console.log('deleted', file.path)
          } catch (e) {
            console.error('failed to delete')
          }
        }
        
      }
    }
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};