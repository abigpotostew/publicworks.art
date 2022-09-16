import { Firestore } from '@google-cloud/firestore';

let singleton:FirestoreStore|undefined=undefined;
export const firestore=()=>{
  if(!singleton){
    singleton=new FirestoreStore();
  }
  return singleton;
}

export class FirestoreStore {
  db:Firestore;
  constructor() {
    const creds=process.env.GCP_SERVICE_ACCOUNT_JSON
    if(!creds){
      throw new Error("Missing end GCP_SERVICE_ACCOUNT_JSON")
    }
    
    this.db=new Firestore({
      credential: JSON.parse(creds),
      projectId: process.env.GCP_PROJECT_ID,
    });
  }
}