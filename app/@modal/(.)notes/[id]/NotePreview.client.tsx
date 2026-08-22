"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import { Modal } from "@/components/Modal/Modal";
import css from "@/app/(private routes)/notes/[id]/NoteDetails.module.css";

interface Props {
  id: string;
}

export default function NotePreviewClient({ id }: Props) {
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });
  const router = useRouter();
  const closeModal = () => {
    router.back();
  };

  if (isLoading) {
    return <Modal>Loading, please wait...</Modal>;
  }

  if (isError || !note) {
    return <Modal>Something went wrong.</Modal>;
  }

  return (
    <Modal onClose={closeModal}>
      <main className={css.main}>
        <div className={css.card}>
          <h2>{note.title}</h2>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
          <button onClick={closeModal}>Close</button>
        </div>
      </main>
    </Modal>
  );
}
