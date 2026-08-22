"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api/clientApi";
import type { CreateNotePayload } from "../../lib/api/clientApi";
import css from "./NoteForm.module.css";
import type { NoteTag } from "@/types/note";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";

export const NoteForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      [event.target.name]: event.target.value,
    });
  };
  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
  });
  const handleSubmit = (formData: FormData) => {
    const values: CreateNotePayload = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as NoteTag,
    };

    mutate(values);
  };
  const handleCancel = () => router.back();

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={draft.title}
          onChange={handleChange}
          className={css.input}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          defaultValue={draft.content}
          onChange={handleChange}
          className={css.textarea}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>
      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
};
export default NoteForm;
