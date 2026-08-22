import { api } from "./api";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export const checkSession = async () => {
  const cookieStore = await cookies();

  const res = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const res = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
