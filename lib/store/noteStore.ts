import { create } from 'zustand';

interface NoteDraft {
  title: string;
  content: string;
  tag: string;
}

interface NoteStore {
  draft: NoteDraft;
  setDraft: (fields: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()((set) => ({
  draft: {
    title: '',
    content: '',
    tag: 'Todo',
  },
  setDraft: (fields) =>
    set((state) => ({
      draft: { ...state.draft, ...fields },
    })),
  clearDraft: () =>
    set({
      draft: { title: '', content: '', tag: 'Todo' },
    }),
}));