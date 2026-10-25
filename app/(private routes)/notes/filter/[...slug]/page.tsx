import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/clientApi';
import NotesClient from '@/app/(private routes)/notes/filter/[...slug]/Notes.client';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  const filterName = slugArray && slugArray.length > 0 ? slugArray.join('/') : 'all';

  return {
    title: `Notes filtered by ${filterName} - NoteHub`,
    description: `Viewing notes filtered by category: ${filterName}`,
    openGraph: {
      title: `Notes filtered by ${filterName} - NoteHub`,
      description: `Viewing notes filtered by category: ${filterName}`,
      url: `https://notehub.com/notes/filter/${filterName}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes filter ${filterName}`,
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.[0] || 'all';
  const tag = slug === 'all' ? undefined : slug;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={slug} />
    </HydrationBoundary>
  );
}