import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Snippet, Tag } from "@/types";
import slugify from "slugify";

// ============================================
// SNIPPET OPERATIONS
// ============================================

export async function createSnippet(data: {
  title: string;
  code: string;
  language: string;
  topic: string;
  tags: string[];
  userId: string;
  userDisplayName: string;
  complexity?: string;
  isPublic: boolean;
}) {
  const slug =
    slugify(data.title, { lower: true, strict: true }) + "-" + Date.now();

  const snippetData = {
    ...data,
    slug,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "snippets"), snippetData);

  await updateDoc(doc(db, "users", data.userId), {
    snippetCount: increment(1),
  });

  for (const tagName of data.tags) {
    const tagSlug = slugify(tagName, { lower: true, strict: true });
    const tagRef = doc(db, "tags", tagSlug);
    const tagSnap = await getDoc(tagRef);

    if (tagSnap.exists()) {
      await updateDoc(tagRef, {
        count: increment(1),
      });
    } else {
      await setDoc(tagRef, {
        name: tagName,
        slug: tagSlug,
        count: 1,
        createdAt: serverTimestamp(),
      });
    }
  }

  return { id: docRef.id, slug };
}

export async function getSnippetBySlug(slug: string) {
  const q = query(
    collection(db, "snippets"),
    where("slug", "==", slug),
    limit(1)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate(),
  } as Snippet;
}

export async function getSnippetById(id: string) {
  const docRef = doc(db, "snippets", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: (docSnap.data().createdAt as Timestamp)?.toDate(),
    updatedAt: (docSnap.data().updatedAt as Timestamp)?.toDate(),
  } as Snippet;
}

export async function getSnippets(options?: {
  isPublic?: boolean;
  userId?: string;
  language?: string;
  tag?: string;
  orderByField?: string;
  limitCount?: number;
}) {
  let q = query(collection(db, "snippets"));

  if (options?.isPublic !== undefined) {
    q = query(q, where("isPublic", "==", options.isPublic));
  }

  if (options?.userId) {
    q = query(q, where("userId", "==", options.userId));
  }

  if (options?.language) {
    q = query(q, where("language", "==", options.language));
  }

  if (options?.tag) {
    q = query(q, where("tags", "array-contains", options.tag));
  }

  q = query(q, orderBy(options?.orderByField || "createdAt", "desc"));

  if (options?.limitCount) {
    q = query(q, limit(options.limitCount));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate(),
  })) as Snippet[];
}

export async function updateSnippet(
  id: string,
  data: {
    title?: string;
    code?: string;
    language?: string;
    topic?: string;
    tags?: string[];
    complexity?: string;
    isPublic?: boolean;
  },
  oldTags?: string[]
) {
  const snippetRef = doc(db, "snippets", id);

  const updateData: any = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.title) {
    updateData.slug =
      slugify(data.title, { lower: true, strict: true }) + "-" + Date.now();
  }

  await updateDoc(snippetRef, updateData);

  if (data.tags && oldTags) {
    const tagsToAdd = data.tags.filter((tag) => !oldTags.includes(tag));
    const tagsToRemove = oldTags.filter((tag) => !data.tags!.includes(tag));

    for (const tagName of tagsToAdd) {
      const tagSlug = slugify(tagName, { lower: true, strict: true });
      const tagRef = doc(db, "tags", tagSlug);
      const tagSnap = await getDoc(tagRef);

      if (tagSnap.exists()) {
        await updateDoc(tagRef, { count: increment(1) });
      } else {
        await setDoc(tagRef, {
          name: tagName,
          slug: tagSlug,
          count: 1,
          createdAt: serverTimestamp(),
        });
      }
    }

    for (const tagName of tagsToRemove) {
      const tagSlug = slugify(tagName, { lower: true, strict: true });
      const tagRef = doc(db, "tags", tagSlug);
      await updateDoc(tagRef, { count: increment(-1) });
    }
  }

  return updateData.slug;
}

export async function deleteSnippet(snippet: Snippet) {
  await deleteDoc(doc(db, "snippets", snippet.id));

  await updateDoc(doc(db, "users", snippet.userId), {
    snippetCount: increment(-1),
  });

  for (const tagName of snippet.tags) {
    const tagSlug = slugify(tagName, { lower: true, strict: true });
    await updateDoc(doc(db, "tags", tagSlug), {
      count: increment(-1),
    });
  }
}

export async function incrementViewCount(id: string) {
  const snippetRef = doc(db, "snippets", id);
  await updateDoc(snippetRef, {
    viewCount: increment(1),
  });
}

// ============================================
// TAG OPERATIONS
// ============================================

export async function getTags(limitCount?: number) {
  let q = query(collection(db, "tags"), orderBy("count", "desc"));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  })) as Tag[];
}

export async function getTagBySlug(slug: string) {
  const docRef = doc(db, "tags", slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as Tag;
}

// ============================================
// USER OPERATIONS
// ============================================

export async function getUserByUsername(username: string) {
  const q = query(
    collection(db, "users"),
    where("username", "==", username),
    limit(1)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return {
    uid: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate(),
  } as {
    uid: string;
    email: string;
    displayName: string;
    username: string;
    photoURL?: string;
    createdAt: Date;
    snippetCount: number;
  };
}

export async function getUserById(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    uid: docSnap.id,
    ...docSnap.data(),
    createdAt: (docSnap.data().createdAt as Timestamp)?.toDate(),
  } as {
    uid: string;
    email: string;
    displayName: string;
    username: string;
    photoURL?: string;
    createdAt: Date;
    snippetCount: number;
  };
}

export async function getUserStats(userId: string) {
  const snippetsQuery = query(
    collection(db, "snippets"),
    where("userId", "==", userId)
  );
  const snippetsSnapshot = await getDocs(snippetsQuery);
  const snippets = snippetsSnapshot.docs.map((doc) => doc.data());

  const totalViews = snippets.reduce(
    (sum, snippet) => sum + (snippet.viewCount || 0),
    0
  );

  const languagesMap = new Map<string, number>();
  snippets.forEach((snippet) => {
    const lang = snippet.language;
    languagesMap.set(lang, (languagesMap.get(lang) || 0) + 1);
  });
  const languages = Array.from(languagesMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const tagsMap = new Map<string, number>();
  snippets.forEach((snippet) => {
    snippet.tags?.forEach((tag: string) => {
      tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
    });
  });
  const topTags = Array.from(tagsMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalSnippets: snippets.length,
    totalViews,
    languages,
    topTags,
  };
}