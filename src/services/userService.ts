import api from './api';

export interface UserSummary {
  id: string; // mapped from _id
  name: string;
  email: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const getUsers = async (): Promise<UserSummary[]> => {
  const res = await api.get<any[]>('/auth/users');
  const data = res.data || [];
  return data.map(u => ({
    id: u._id || u.id || '',
    name: u.name,
    email: u.email,
    createdAt: u.createdAt || null,
    updatedAt: u.updatedAt || null,
  }));
};

export default { getUsers };
