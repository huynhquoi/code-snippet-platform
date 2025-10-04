import { collection } from "firebase/firestore";
import { db } from "./config";

export const usersCollection = collection(db, "users");
export const snippetsCollection = collection(db, "snippets");
export const tagsCollection = collection(db, "tags");
