import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import slugify from "slugify";

// Đăng ký user mới
export async function signUp(
  email: string,
  password: string,
  displayName: string
) {
  // Create auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Update profile
  await updateProfile(user, { displayName });

  // Generate username from displayName
  const username =
    slugify(displayName, { lower: true, strict: true }) +
    "-" +
    user.uid.slice(0, 6);

  // Create user document in Firestore
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

// Đăng nhập
export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

// Đăng xuất
export async function signOut() {
  await firebaseSignOut(auth);
}
