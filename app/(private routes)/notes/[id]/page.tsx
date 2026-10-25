import type { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api/clientApi';
import NoteDetailsClient from './NoteDetails.client';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  let noteTitle = 'Note Details';
  let noteDescription = 'View note details in NoteHub';

  try {
    const note = await fetchNoteById(id);
    if (note) {
      noteTitle = `${note.title} - NoteHub`;
      noteDescription = note.content.slice(0, 100);
    }
  } catch (error) {
    console.error('Error fetching note for metadata:', error);
  }

  return {
    title: noteTitle,
    description: noteDescription,
    openGraph: {
      title: noteTitle,
      description: noteDescription,
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: noteTitle,
        },
      ],
    },
  };
}

export default async function NoteDetailsPage() {
  return (
    <main>
      <NoteDetailsClient />
    </main>
  );
}