import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import slugify from "slugify";

export async function signUp(
  email: string,
  password: string,
  displayName: string
) {

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName });

  const username =
    slugify(displayName, { lower: true, strict: true }) +
    "-" +
    user.uid.slice(0, 6);

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: displayName,
    username: username,
    photoURL: null,
    createdAt: serverTimestamp(),
    snippetCount: 0,
  });

  return user;
}

export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}
