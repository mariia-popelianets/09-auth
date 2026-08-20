import type { Metadata } from "next";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface Props {
  params: Promise<{
    slug?: string[];
  }>;
}

export function getTagFromSlug(slug?: string[]): string | undefined {
  const rawTag = slug?.[0];

  if (!rawTag || rawTag === "all") {
    return undefined;
  }

  return rawTag;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagFromSlug(slug);

  return {
    title: tag ? `Notes: ${tag}` : "All notes | NoteHub",
    description: tag ? `Notes filtered by ${tag}` : "All notes in NoteHub",
    openGraph: {
      title: tag ? `Notes: ${tag}` : "All notes | NoteHub",
      description: tag ? `Notes filtered by ${tag}` : "All notes in NoteHub",
      url: "https://notehub.com/",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub application",
        },
      ],
    },
  };
}

const Notes = async ({ params }: Props) => {
  const { slug } = await params;

  const tag = getTagFromSlug(slug);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default Notes;
