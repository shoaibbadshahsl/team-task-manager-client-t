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

export const updateUser = async (id: string, userData: { name: string; email: string }): Promise<UserSummary> => {
  const res = await api.put(`/auth/users/${id}`, userData);
  const u = res.data;
  return {
    id: u._id || u.id || '',
    name: u.name,
    email: u.email,
    createdAt: u.createdAt || null,
    updatedAt: u.updatedAt || null,
  };
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/auth/users/${id}`);
};

export default { getUsers, updateUser, deleteUser };
