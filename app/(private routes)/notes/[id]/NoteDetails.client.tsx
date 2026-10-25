'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NoteDetails.module.css';

export default function NoteDetailsClient() {
  const params = useParams();
  const id = params?.id as string;

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading note details...</p>;
  if (isError || !note) return <p>Error loading note details.</p>;

  return (
    <div className={css.container}>
      <span className={css.tag}>{note.tag}</span>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.content}>{note.content}</p>
      <p className={css.date}>Created: {new Date(note.createdAt).toLocaleDateString()}</p>
    </div>
  );
}