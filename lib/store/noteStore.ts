import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreateNotePayload } from "@/lib/api/clientApi";

type NoteDraftStore = {
  draft: CreateNotePayload;
  setDraft: (note: Partial<CreateNotePayload>) => void;
  clearDraft: () => void;
};
const initialDraft: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};
export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
