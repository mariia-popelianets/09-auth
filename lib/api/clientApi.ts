import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const res = await api.get<FetchNotesResponse>("/notes", { params });

  return res.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};
export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};
export type RegisterRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};
export const login = async (data: LoginRequest): Promise<User> => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

type CheckSessionResponse = {
  success: boolean;
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await api.get<CheckSessionResponse>("/auth/session");
  return data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export type UpdateMeRequest = {
  username: string;
};

export const updateMe = async (data: UpdateMeRequest): Promise<User> => {
  const res = await api.patch<User>("/users/me", data);
  return res.data;
};
