export interface User {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL?: string;
  createdAt: Date;
  snippetCount: number;
}

export interface Snippet {
  id: string;
  title: string;
  slug: string;
  code: string;
  language: string;
  topic: string;
  tags: string[];
  userId: string;
  userDisplayName: string;
  username: string;
  complexity?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
}
