"use client";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import { NoteList } from "@/components/NoteList/NoteList";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { Pagination } from "@/components/Pagination/Pagination";
import Link from "next/link";
import css from "./NotesPage.module.css";
interface NotesClientProps {
  tag?: string;
}
export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebouncedCallback((val: string) => {
    setSearchTerm(val);
    setPage(1);
  }, 300);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    debouncedSearch(val);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, searchTerm, tag],
    queryFn: () => fetchNotes({ page, perPage: 12, search: searchTerm, tag }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        )}

        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes.</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
