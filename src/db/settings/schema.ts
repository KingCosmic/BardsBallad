import { AutomergeUrl, Repo } from '@automerge/react';
import { z } from 'zod';

export const ROOT_DOC_URL_KEY = 'root-doc-url'
export const getOrCreateRoot = (repo: Repo): AutomergeUrl => {
  // Check if we already have a root document
  const existingUrl = localStorage.getItem(ROOT_DOC_URL_KEY);
  if (existingUrl) {
    return existingUrl as AutomergeUrl;
  }
  // Otherwise create one and (synchronously) store it
  const root = repo.create<User>({
    avatar: '',
    username: 'Guest',
    bio: '',
    theme: 'default',
    schema: 'system',
    characters: [],
    subscriptions: []
  });

  localStorage.setItem(ROOT_DOC_URL_KEY, root.url);
  return root.url;
};

const userSchema = z.object({
  avatar: z.string(),
  username: z.string(),
  bio: z.string(),
  theme: z.string(),
  schema: z.enum(['system', 'light', 'dark']),
  characters: z.array(z.string()),
  subscriptions: z.array(z.string())
})

export type User = {
  avatar: string;
  username: string;
  bio: string;
  theme: string;
  schema: string;
  characters: AutomergeUrl[];
  subscriptions: any[]
};

export default userSchema