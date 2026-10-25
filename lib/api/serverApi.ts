import { api } from './api';
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}

export async function fetchNotes(params = {}) {
  const config = await getAuthHeaders();
  const response = await api.get('/notes', { ...config, params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const config = await getAuthHeaders();
  const response = await api.get(`/notes/${id}`, config);
  return response.data;
}

export async function checkSession(): Promise<User | null> {
  try {
    const config = await getAuthHeaders();
    const response = await api.get('/auth/session', config);
    return response.data || null;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User> {
  const config = await getAuthHeaders();
  const response = await api.get('/users/me', config);
  return response.data;
}