'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/clientApi';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        {isLoading && <p>Loading note details...</p>}
        {isError && <p>Error loading note details.</p>}
        {note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2 className={css.title}>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <button
              type="button"
              className={css.backBtn}
              onClick={() => router.back()}
            >
              Back to notes
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}