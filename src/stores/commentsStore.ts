import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Comment } from "../types";

interface CommentsStore {
  localComments: Comment[];
  addComment: (comment: Comment) => void;
}

export const useCommentsStore = create<CommentsStore>()(
  persist(
    (set) => ({
      localComments: [],
      addComment: (comment) =>
        set((state) => ({ localComments: [...state.localComments, comment] })),
    }),
    { name: "sprintdesk-comments" },
  ),
);
