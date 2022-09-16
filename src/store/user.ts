import { FirestoreStore } from "./firestore";
import { Err, Ok, Result } from "../util/result";
import { User, UserFullZ } from "./user.types";
import { Firestore } from "@google-cloud/firestore";


export class UserRepo {
  private readonly db: Firestore;

  constructor(store: FirestoreStore) {
    this.db = store.db;
  }

  async getUser(address: string): Promise<Result<User>> {
    let query = this.db
      .collection('users')
      .where('address', '==', address)
      .limit(1);
    const users = await query.get();
    if (users.empty) {
      return Err(new Error('no user for account'));
    }
    const user = UserFullZ.parse(users.docs[0].data());

    return Ok(user);
  }

  
}