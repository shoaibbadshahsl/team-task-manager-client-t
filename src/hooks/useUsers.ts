import { useState, useEffect } from 'react';
import { getUsers, UserSummary } from '../services/userService';

export function useUsers() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUsers();
        if (mounted) setUsers(res);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load users');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return { users, loading, error } as { users: UserSummary[]; loading: boolean; error: string | null };
}

export default useUsers;
