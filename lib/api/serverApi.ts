import axios from 'axios';
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note';

const serverApi = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

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
  const response = await serverApi.get('/notes', { ...config, params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const config = await getAuthHeaders();
  const response = await serverApi.get(`/notes/${id}`, config);
  return response.data;
}

export async function checkSession() {
  const config = await getAuthHeaders();
  return await serverApi.get('/auth/session', config);
}

export async function getMe(): Promise<User> {
  const config = await getAuthHeaders();
  const response = await serverApi.get('/users/me', config);
  return response.data;
}