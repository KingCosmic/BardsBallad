import { useDocument } from '@automerge/react';
import { getOrCreateRoot, User } from '../schema';
import repo from '@/db';

export default function useUser() {
  return useDocument<User>(getOrCreateRoot(repo))
}