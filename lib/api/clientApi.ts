import { api } from './api/api';
import { Note, CreateNoteDto } from '@/types/note';
import { User } from '@/types/user';

export interface AuthCredentials {
  email: string;
  password: string;
}

export async function fetchNotes(params = {}) {
  const response = await api.get('/notes', { params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get(`/notes/${id}`);
  return response.data;
}

export async function createNote(newNote: CreateNoteDto): Promise<Note> {
  const response = await api.post('/notes', newNote);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
}

export async function register(credentials: AuthCredentials): Promise<User> {
  const response = await api.post('/auth/register', credentials);
  return response.data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<User | null> {
  const response = await api.get('/auth/session');
  return response.data || null;
}

export async function getMe(): Promise<User> {
  const response = await api.get('/users/me');
  return response.data;
}

export async function updateMe(data: { username: string }): Promise<User> {
  const response = await api.patch('/users/me', data);
  return response.data;
}